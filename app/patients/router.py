"""
Patient CRUD routes.
"""

import uuid

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.core.schemas import PaginatedResponse
from app.db.dependencies import get_db
from app.patients.schemas import PatientCreate, PatientResponse, PatientUpdate
from app.patients.service import (
    create_patient,
    delete_patient,
    get_patient,
    get_patients,
    update_patient,
)

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("", response_model=PaginatedResponse[PatientResponse])
def list_patients(
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """List patients with optional search and pagination."""
    items, total = get_patients(db, page=page, page_size=page_size, search=search)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient_endpoint(
    data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PatientResponse:
    """Create a new patient."""
    patient = create_patient(db, data)
    return PatientResponse.model_validate(patient)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient_endpoint(
    patient_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PatientResponse:
    """Retrieve a single patient by ID."""
    patient = get_patient(db, patient_id)
    return PatientResponse.model_validate(patient)


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient_endpoint(
    patient_id: uuid.UUID,
    data: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PatientResponse:
    """Update an existing patient."""
    patient = update_patient(db, patient_id, data)
    return PatientResponse.model_validate(patient)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient_endpoint(
    patient_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    """Delete a patient by ID."""
    delete_patient(db, patient_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
