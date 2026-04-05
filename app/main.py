"""FastAPI application with health check endpoint."""

from datetime import datetime, timezone

from fastapi import FastAPI

from app.schemas import HealthResponse

app = FastAPI(title="Health Check API", version="0.1.0")


@app.get("/")
def root() -> dict[str, str]:
    """Root endpoint."""
    return {"message": "AI Sandbox is running"}


@app.get("/api/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Return current health status with a UTC timestamp."""
    return HealthResponse(
        status="ok",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
