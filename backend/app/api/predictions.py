from fastapi import APIRouter
import json
import random

router = APIRouter()

@router.get("/")
def get_predictions():
    try:
        from ..models.ml_model import get_atm_predictions
        predictions = get_atm_predictions(limit=10)
        return {"status": "success", "data": predictions}
    except Exception as e:
        return {"status": "error", "message": str(e)}
