import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app.models import Base
from app.routers.staff import router as staff_router
from app.mock_data.staff_generator import generate_staff_data
from app.crud.staff import create_staff

logger = logging.getLogger(__name__)

app = FastAPI(title="AI Sandbox", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(staff_router)


@app.get("/")
def root():
    return {"message": "AI Sandbox is running"}


@app.post("/generate-mock-data")
def generate_mock_data(
    count: int = 10,
    db: Session = Depends(get_db),
):
    """Generate mock staff data for testing purposes."""
    staff_data = generate_staff_data(count=count)
    created = []
    for staff in staff_data:
        try:
            db_staff = create_staff(db, staff)
            created.append(db_staff.id)
        except Exception:
            logger.warning("Skipped duplicate email: %s", staff.email)
            db.rollback()
    return {"message": f"Generated {len(created)} mock staff members", "ids": created}
