import asyncio
import json
import pandas as pd
import random
import requests
import time
import os

def simulate_stream():
    print("Starting live stream simulation...")
    import os
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.abspath(os.path.join(base_dir, '../../data/synthetic_complaints.csv'))
    
    try:
        df = pd.read_csv(csv_path)
        records = df.to_dict(orient="records")
        
        while True:
            # Pick a random record to simulate new live data
            new_complaint = random.choice(records)
            
            # Change the ID slightly to make it look new
            new_complaint["complaint_id"] = new_complaint["complaint_id"] + "-LIVE"
            
            try:
                # Send to ingest API
                ingest_url = os.environ.get("INGEST_URL", "http://localhost:8000/api/v1/complaints/ingest")
                response = requests.post(ingest_url, json=new_complaint)
                if response.status_code == 200:
                    print(f"Ingested New Complaint: {new_complaint['complaint_id']}")
                else:
                    print(f"Failed to ingest: {response.text}")
            except Exception as e:
                print(f"Connection failed (is backend running?): {e}")
                
            time.sleep(5)
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    simulate_stream()
