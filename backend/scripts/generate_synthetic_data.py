import pandas as pd
import numpy as np
import uuid
import random
from datetime import datetime, timedelta
import os

# Ensure data directory exists
os.makedirs('../../data', exist_ok=True)

# Delhi target area bounds roughly
# Hotspots (Lat, Lon) for synthetic clustering
HOTSPOTS = [
    (28.6304, 77.2177), # Connaught Place
    (28.5921, 77.0460), # Dwarka
    (28.6304, 77.2773), # Laxmi Nagar
    (28.7366, 77.1130)  # Rohini
]

BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "BOB"]
FRAUD_TYPES = ["OTP", "Phishing", "Loan_App", "Customer_Care", "Sextortion"]
STATUSES = ["withdrawn", "frozen", "pending"]

def generate_random_point_near(lat, lon, max_offset=0.02):
    return (lat + random.uniform(-max_offset, max_offset), 
            lon + random.uniform(-max_offset, max_offset))

def generate_mule_chain():
    length = random.randint(1, 4)
    return ",".join([str(uuid.uuid4())[:8] for _ in range(length)])

def generate_data(num_records=5000):
    data = []
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    
    for _ in range(num_records):
        complaint_id = f"COMP-{str(uuid.uuid4())[:8].upper()}"
        
        # Timeline
        fraud_ts = start_date + timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))
        report_ts = fraud_ts + timedelta(hours=random.randint(1, 48))
        withdrawal_ts = fraud_ts + timedelta(hours=random.randint(2, 24))
        
        # Location logic (70% cluster around hotspots, 30% random in Delhi)
        if random.random() < 0.7:
            hotspot = random.choice(HOTSPOTS)
            atm_lat, atm_lon = generate_random_point_near(hotspot[0], hotspot[1], max_offset=0.03)
        else:
            atm_lat = random.uniform(28.4, 28.9)
            atm_lon = random.uniform(76.8, 77.3)
            
        data.append({
            "complaint_id": complaint_id,
            "timestamp_reported": report_ts.isoformat(),
            "timestamp_fraud_occurred": fraud_ts.isoformat(),
            "victim_bank": random.choice(BANKS),
            "victim_city": "Delhi",
            "victim_state": "Delhi",
            "amount": round(random.uniform(5000, 500000), 2),
            "fraud_type": random.choice(FRAUD_TYPES),
            "mule_account_chain": generate_mule_chain(),
            "final_withdrawal_bank": random.choice(BANKS),
            "final_withdrawal_atm_lat": atm_lat,
            "final_withdrawal_atm_lon": atm_lon,
            "withdrawal_timestamp": withdrawal_ts.isoformat() if random.random() > 0.1 else None,
            "status": random.choice(STATUSES)
        })
        
    df = pd.DataFrame(data)
    df.to_csv('../../data/synthetic_complaints.csv', index=False)
    print(f"Generated {num_records} synthetic complaints for Delhi area in data/synthetic_complaints.csv")

if __name__ == "__main__":
    generate_data(5000)
