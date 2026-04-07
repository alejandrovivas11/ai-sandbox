import logging
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import Base, engine, SessionLocal
from app.models.staff import Staff
from app.routers.staff import router as staff_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_title, version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(staff_router)


def seed_staff_data() -> None:
    """Seed database with realistic healthcare staff data."""
    db = SessionLocal()
    try:
        if db.query(Staff).count() > 0:
            logger.info("Staff data already seeded, skipping")
            return

        seed_records = [
            Staff(name="Sarah Chen", role="Physician", department="Primary Care", email="sarah.chen@3yhealth.com", phone="(555) 101-2001", status="Active", hireDate=datetime(2023, 1, 15)),
            Staff(name="James Rodriguez", role="Nurse Practitioner", department="Primary Care", email="james.rodriguez@3yhealth.com", phone="(555) 101-2002", status="Active", hireDate=datetime(2023, 3, 22)),
            Staff(name="Emily Johnson", role="Registered Nurse", department="Emergency", email="emily.johnson@3yhealth.com", phone="(555) 101-2003", status="Active", hireDate=datetime(2022, 8, 10)),
            Staff(name="Michael Thompson", role="Medical Assistant", department="Pediatrics", email="michael.thompson@3yhealth.com", phone="(555) 101-2004", status="Onboarding", hireDate=datetime(2024, 11, 1)),
            Staff(name="Aisha Patel", role="Physician", department="Cardiology", email="aisha.patel@3yhealth.com", phone="(555) 101-2005", status="Active", hireDate=datetime(2021, 6, 18)),
            Staff(name="David Kim", role="Physical Therapist", department="Rehabilitation", email="david.kim@3yhealth.com", phone="(555) 101-2006", status="Active", hireDate=datetime(2023, 9, 5)),
            Staff(name="Maria Garcia", role="Office Manager", department="Administration", email="maria.garcia@3yhealth.com", phone="(555) 101-2007", status="Active", hireDate=datetime(2020, 2, 14)),
            Staff(name="Robert Williams", role="Pharmacist", department="Pharmacy", email="robert.williams@3yhealth.com", phone="(555) 101-2008", status="Inactive", hireDate=datetime(2022, 4, 1)),
            Staff(name="Jennifer Lee", role="Registered Nurse", department="Surgery", email="jennifer.lee@3yhealth.com", phone="(555) 101-2009", status="Active", hireDate=datetime(2021, 11, 30)),
            Staff(name="Daniel Martinez", role="Billing Specialist", department="Revenue Cycle", email="daniel.martinez@3yhealth.com", phone="(555) 101-2010", status="Onboarding", hireDate=datetime(2024, 12, 15)),
            Staff(name="Lisa Brown", role="Nurse Practitioner", department="Geriatrics", email="lisa.brown@3yhealth.com", phone="(555) 101-2011", status="Active", hireDate=datetime(2023, 7, 20)),
            Staff(name="Kevin Nguyen", role="IT Support Analyst", department="Information Technology", email="kevin.nguyen@3yhealth.com", phone="(555) 101-2012", status="Inactive", hireDate=datetime(2022, 10, 8)),
        ]

        db.add_all(seed_records)
        db.commit()
        logger.info("Seeded %d staff records", len(seed_records))
    finally:
        db.close()


@app.on_event("startup")
def on_startup() -> None:
    """Initialize database tables and seed data on application startup."""
    Base.metadata.create_all(bind=engine)
    seed_staff_data()


@app.get("/")
def root():
    return {"message": "AI Sandbox is running"}
