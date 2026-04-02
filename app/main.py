from datetime import datetime, timezone

from fastapi import FastAPI

from app.models import StatusResponse

app = FastAPI(title="AI Sandbox", version="0.1.0")


@app.get("/")
def root():
    return {"message": "AI Sandbox is running"}


@app.get("/status", response_model=StatusResponse)
def status() -> StatusResponse:
    return StatusResponse(
        app_name=app.title,
        version=app.version,
        status="operational",
        timestamp=datetime.now(timezone.utc),
    )
