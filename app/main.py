"""Patient Management API application."""

from fastapi import FastAPI

from app.routes.patients import router as patients_router
from app.routes.dashboard import router as dashboard_router

app = FastAPI(title="Patient Management API", version="1.0.0")

app.include_router(patients_router)
app.include_router(dashboard_router)


@app.get("/")
def root() -> dict:
    """Root endpoint returning API identification."""
    return {"message": "Patient Management API"}
