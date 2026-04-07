import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.staff import StaffCreate, StaffUpdate, StaffResponse
from app.services.staff import StaffService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/staff", tags=["staff"])


@router.get("", response_model=list[StaffResponse])
def list_staff(
    search: Optional[str] = None,
    role: Optional[str] = None,
    department: Optional[str] = None,
    db: Session = Depends(get_db),
) -> list[StaffResponse]:
    """List all staff members with optional search and filters."""
    service = StaffService(db)
    return service.get_all_staff(
        search=search,
        role_filter=role,
        department_filter=department,
    )


@router.get("/{staff_id}", response_model=StaffResponse)
def get_staff(
    staff_id: int,
    db: Session = Depends(get_db),
) -> StaffResponse:
    """Retrieve a single staff member by ID."""
    service = StaffService(db)
    staff = service.get_staff_by_id(staff_id)
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Staff member with id {staff_id} not found",
        )
    return staff


@router.post("", response_model=StaffResponse, status_code=status.HTTP_201_CREATED)
def create_staff(
    data: StaffCreate,
    db: Session = Depends(get_db),
) -> StaffResponse:
    """Create a new staff member."""
    service = StaffService(db)
    return service.create_staff(data)


@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff(
    staff_id: int,
    data: StaffUpdate,
    db: Session = Depends(get_db),
) -> StaffResponse:
    """Update an existing staff member."""
    service = StaffService(db)
    staff = service.update_staff(staff_id, data)
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Staff member with id {staff_id} not found",
        )
    return staff
