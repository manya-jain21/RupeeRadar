import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

def train():
    print("Training XGBoost Model...")
    df = pd.read_csv('../../data/synthetic_complaints.csv')
    
    # Feature Engineering
    # We want to predict if a location will see a withdrawal (for this prototype, we'll just mock a target variable)
    # Let's say high amounts or specific fraud types are higher risk
    df['hour'] = pd.to_datetime(df['timestamp_reported']).dt.hour
    df['day_of_week'] = pd.to_datetime(df['timestamp_reported']).dt.dayofweek
    
    # Target variable: 1 if status is withdrawn (meaning this pattern led to a withdrawal), else 0
    df['target'] = df['status'].apply(lambda x: 1 if x == 'withdrawn' else 0)
    
    # Features
    features = ['amount', 'hour', 'day_of_week']
    X = df[features]
    y = df['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Model Accuracy: {acc:.2f}")
    
    # Save model
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.abspath(os.path.join(base_dir, '../app/models/saved'))
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, 'xgb_risk_model.pkl'))
    print("Model saved to", os.path.join(model_dir, 'xgb_risk_model.pkl'))

if __name__ == "__main__":
    train()
