"""
FastAPI application entry point for the Clinic Management System.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.appointments.router import router as appointments_router
from app.auth.router import router as auth_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import setup_logging
from app.dashboard.router import router as dashboard_router
from app.patients.router import router as patients_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Application lifespan: setup logging and seed default admin on startup."""
    setup_logging()
    _seed_default_admin()
    yield


def _seed_default_admin() -> None:
    """Seed the default admin user if no users exist."""
    try:
        from app.db.session import SessionLocal
        from app.auth.models import User
        from app.auth.security import hash_password

        db = SessionLocal()
        try:
            user_count = db.query(User).count()
            if user_count == 0:
                import uuid
                admin = User(
                    id=uuid.uuid4(),
                    email="admin@clinic.com",
                    hashed_password=hash_password("admin123"),
                    full_name="Admin User",
                    is_active=True,
                )
                db.add(admin)
                db.commit()
                logger.info("Default admin user created: admin@clinic.com")
        except Exception as exc:
            logger.warning("Could not seed admin user: %s", exc)
            db.rollback()
        finally:
            db.close()
    except Exception as exc:
        logger.warning("Could not connect to database for admin seeding: %s", exc)


app = FastAPI(
    title="Clinic Management System",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(auth_router, prefix="/api")
app.include_router(patients_router, prefix="/api")
app.include_router(appointments_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")


@app.get("/api/health")
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}
