import pytest
from sqlalchemy import Column, ForeignKey, Integer, create_engine
from sqlalchemy.orm import relationship, sessionmaker
from fastapi.testclient import TestClient

from app.database import Base, get_db
from app.models import Patient  # noqa: F401 -- register models with Base.metadata
from app.main import app


# Stub Appointment model to satisfy Patient.appointments relationship
# until the real Appointment model is implemented.
class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    patient = relationship("Patient", back_populates="appointments")

SQLALCHEMY_DATABASE_URL = "sqlite://"


@pytest.fixture(scope="function")
def db_engine():
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture(scope="function")
def db_session(db_engine):
    testing_session_local = sessionmaker(
        autocommit=False, autoflush=False, bind=db_engine
    )

    def override_get_db():
        db = testing_session_local()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    db = testing_session_local()
    try:
        yield db
    finally:
        db.close()
        app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def client(db_engine):
    testing_session_local = sessionmaker(
        autocommit=False, autoflush=False, bind=db_engine
    )

    def override_get_db():
        db = testing_session_local()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
