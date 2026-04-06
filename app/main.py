"""Patient Management API application."""

from fastapi import FastAPI

from app import storage
from app.routes.appointments import router as appointments_router
from app.routes.dashboard import router as dashboard_router
from app.routes.patients import router as patients_router

app = FastAPI(title="Patient Management API", version="1.0.0")


@app.on_event("startup")
def startup() -> None:
    """Initialize the database on application startup."""
    storage.init_db()


app.include_router(patients_router)
app.include_router(appointments_router)
app.include_router(dashboard_router)


@app.get("/")
def root() -> dict:
    """Root endpoint returning API identification."""
    return {"message": "Patient Management API"}
