import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import staff as staff_crud
from app.schemas.staff import StaffCreate, StaffUpdate, StaffResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/staff", tags=["staff"])


@router.get("", response_model=list[StaffResponse])
def list_staff(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    role: Optional[str] = Query(None),
    team: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
) -> list[StaffResponse]:
    """List all staff with optional filtering."""
    staff = staff_crud.get_staff(
        db, skip=skip, limit=limit, role=role, team=team,
        status=status, search=search,
    )
    return staff


@router.post("", response_model=StaffResponse, status_code=201)
def create_staff(
    staff: StaffCreate,
    db: Session = Depends(get_db),
) -> StaffResponse:
    """Create a new staff member."""
    existing = staff_crud.get_staff_by_email(db, staff.email)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="A staff member with this email already exists",
        )
    return staff_crud.create_staff(db, staff)


@router.get("/{staff_id}", response_model=StaffResponse)
def get_staff(
    staff_id: int,
    db: Session = Depends(get_db),
) -> StaffResponse:
    """Get a staff member by ID."""
    db_staff = staff_crud.get_staff_by_id(db, staff_id)
    if db_staff is None:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return db_staff


@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff(
    staff_id: int,
    staff_update: StaffUpdate,
    db: Session = Depends(get_db),
) -> StaffResponse:
    """Update a staff member."""
    db_staff = staff_crud.update_staff(db, staff_id, staff_update)
    if db_staff is None:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return db_staff


@router.delete("/{staff_id}", status_code=204)
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
) -> None:
    """Delete a staff member."""
    deleted = staff_crud.delete_staff(db, staff_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return None
