"""
Patient service layer for CRUD operations.
"""

import uuid

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.patients.models import Patient
from app.patients.schemas import PatientCreate, PatientUpdate


def create_patient(db: Session, data: PatientCreate) -> Patient:
    """Create a new patient record."""
    patient = Patient(
        id=uuid.uuid4(),
        first_name=data.first_name,
        last_name=data.last_name,
        date_of_birth=data.date_of_birth,
        gender=data.gender,
        phone=data.phone,
        email=data.email,
        address=data.address,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


def get_patient(db: Session, patient_id: uuid.UUID) -> Patient:
    """Retrieve a single patient by ID. Raises NotFoundException if not found."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if patient is None:
        raise NotFoundException(detail="Patient not found")
    return patient


def get_patients(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
) -> tuple[list[Patient], int]:
    """Retrieve paginated patients with optional search filtering.

    Search applies ILIKE on first_name, last_name, and email.
    Returns (items, total_count).
    """
    query = db.query(Patient)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Patient.first_name.ilike(search_term),
                Patient.last_name.ilike(search_term),
                Patient.email.ilike(search_term),
            )
        )

    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    return items, total


def update_patient(
    db: Session, patient_id: uuid.UUID, data: PatientUpdate
) -> Patient:
    """Update an existing patient. Only non-None fields are updated."""
    patient = get_patient(db, patient_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)
    return patient


def delete_patient(db: Session, patient_id: uuid.UUID) -> None:
    """Delete a patient by ID. Raises NotFoundException if not found."""
    patient = get_patient(db, patient_id)
    db.delete(patient)
    db.commit()
