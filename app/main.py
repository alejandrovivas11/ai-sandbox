from datetime import datetime, timezone

from fastapi import FastAPI

from app.database import Base, engine
from app.models import StatusResponse

app = FastAPI(title="AI Sandbox", version="0.1.0")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


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
