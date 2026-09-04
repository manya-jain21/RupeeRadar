from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import complaints, predictions, atms
from .ws import live_feed

app = FastAPI(title="SIH Cybercrime Prototype", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(complaints.router, prefix="/api/v1/complaints", tags=["Complaints"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["Predictions"])
app.include_router(atms.router, prefix="/api/v1/atms", tags=["ATMs"])
app.include_router(live_feed.router, prefix="/ws", tags=["Live Feed"])

@app.on_event("startup")
def startup_event():
    import threading
    import sys
    import os
    # Add scripts directory to path to import simulator
    sys.path.append(os.path.join(os.path.dirname(__file__), '../scripts'))
    try:
        from simulate_live_stream import simulate_stream
        # Start in daemon thread so it doesn't block FastAPI shutdown
        t = threading.Thread(target=simulate_stream, daemon=True)
        t.start()
        print("Live stream simulator started in background thread.")
    except Exception as e:
        print(f"Failed to start simulator: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to SIH Cybercrime Cash Withdrawal Prediction API"}
