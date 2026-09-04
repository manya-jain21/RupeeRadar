from fastapi import APIRouter
import json

router = APIRouter()

@router.get("/")
def get_atms():
    try:
        with open("../../data/atm_locations.geojson", "r") as f:
            data = json.load(f)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
