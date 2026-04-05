"""Patient API routes."""

from fastapi import APIRouter, HTTPException, Response

from app.models.patient import PatientCreate, PatientResponse, PatientUpdate
from app.services import patient_service

router = APIRouter(prefix="/patients", tags=["patients"])


@router.post("/", response_model=PatientResponse, status_code=201)
def create_patient(data: PatientCreate) -> dict:
    """Create a new patient."""
    return patient_service.create_patient(data)


@router.get("/", response_model=list[PatientResponse])
def get_patients() -> list[dict]:
    """Return all patients."""
    return patient_service.get_all_patients()


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: str) -> dict:
    """Return a single patient by id."""
    patient = patient_service.get_patient(patient_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: str, data: PatientUpdate) -> dict:
    """Partially update an existing patient."""
    patient = patient_service.update_patient(patient_id, data)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.delete("/{patient_id}", status_code=204)
def delete_patient(patient_id: str) -> Response:
    """Delete a patient by id."""
    deleted = patient_service.delete_patient(patient_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Patient not found")
    return Response(status_code=204)
