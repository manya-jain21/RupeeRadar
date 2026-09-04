from fastapi import APIRouter
from typing import List, Dict, Any
import pandas as pd
import json
from ..ws.live_feed import manager

router = APIRouter()

@router.get("/")
def get_complaints(limit: int = 50):
    try:
        import os
        base_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.abspath(os.path.join(base_dir, '../../../data/synthetic_complaints.csv'))
        df = pd.read_csv(csv_path)
        # Replace NaN/NaT with None so JSON can serialize it
        import numpy as np
        df = df.replace({np.nan: None})
        records = df.head(limit).to_dict(orient="records")
        return {"status": "success", "data": records}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/{complaint_id}")
def get_complaint(complaint_id: str):
    try:
        import os
        base_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.abspath(os.path.join(base_dir, '../../../data/synthetic_complaints.csv'))
        df = pd.read_csv(csv_path)
        record = df[df['complaint_id'] == complaint_id]
        if not record.empty:
            import numpy as np
            record = record.replace({np.nan: None})
            return {"status": "success", "data": record.iloc[0].to_dict()}
        return {"status": "error", "message": "Complaint not found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/ingest")
async def ingest_complaint(complaint: Dict[Any, Any]):
    try:
        # In a real app, we'd save to DB here
        # For the prototype, we just broadcast it to the live feed
        await manager.broadcast(json.dumps({
            "type": "NEW_COMPLAINT",
            "data": complaint
        }))
        return {"status": "success", "message": "Complaint ingested and broadcasted"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
