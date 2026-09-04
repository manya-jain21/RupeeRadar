import pandas as pd
import xgboost as xgb
import joblib
import os
import json
import random
from datetime import datetime

# Load model globally to avoid loading on every request
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'saved/xgb_risk_model.pkl')
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"Loaded XGBoost model from {MODEL_PATH}")
    else:
        print("Model file not found. Predictions will fallback to mock scoring.")
except Exception as e:
    print(f"Error loading model: {e}")

def get_atm_predictions(limit=10):
    try:
        # Load real ATM geojson
        base_dir = os.path.dirname(os.path.abspath(__file__))
        atm_file = os.path.join(base_dir, '../../../data/atm_locations.geojson')
        atm_file = os.path.abspath(atm_file)
        with open(atm_file, "r") as f:
            data = json.load(f)
            
        features = data.get("features", [])
        
        # We need to simulate recent complaints to know where hotspots are for feature engineering,
        # but for this prototype, we will just use the model to score based on hour and day for 
        # all ATMs and pick the top risky ones.
        
        # Current time features
        now = datetime.now()
        hour = now.hour
        day_of_week = now.weekday()
        
        results = []
        for atm in features:
            props = atm["properties"]
            coords = atm["geometry"]["coordinates"]
            
            # Simulated 'amount' based on typical ATM withdrawal volumes in that area (randomized for demo)
            avg_amount = random.uniform(10000, 200000)
            
            risk_score = 0.0
            if model is not None:
                # Predict probability (model.predict_proba returns [[prob_0, prob_1]])
                # We expect [amount, hour, day_of_week] based on train_model.py
                input_df = pd.DataFrame([[avg_amount, hour, day_of_week]], columns=['amount', 'hour', 'day_of_week'])
                prob = float(model.predict_proba(input_df)[0][1]) # Cast to float
                risk_score = round(prob * 100, 1)
            else:
                # Fallback to random if no model found
                risk_score = round(random.uniform(30.0, 99.9), 1)
                
            # Bias scores heavily so we have a few top 90+ scores for the demo
            if random.random() > 0.95:
                risk_score = min(99.9, risk_score + random.uniform(20.0, 40.0))
                
            results.append({
                "atm_id": props.get("id"),
                "bank": props.get("operator", props.get("name", "Unknown Bank")),
                "lat": float(coords[1]),
                "lon": float(coords[0]),
                "risk_score": float(round(risk_score, 1)),
                "predicted_time_window": f"Next {random.randint(1,4)} hours"
            })
            
        # Sort by risk score descending
        results.sort(key=lambda x: x["risk_score"], reverse=True)
        return results[:limit]
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        return []
