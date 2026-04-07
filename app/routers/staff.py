"""Staff management API endpoints."""

import logging
from typing import Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException, Query, status

from app.data.mock_staff import MOCK_STAFF
from app.models import Staff, StaffCreate, StaffStatus, StaffUpdate

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/staff", tags=["staff"])

# In-memory store initialized from mock data
_staff_db: list[Staff] = list(MOCK_STAFF)


def _get_staff_db() -> list[Staff]:
    """Return the current staff database."""
    return _staff_db


@router.get("", response_model=list[Staff])
def list_staff(
    search: Optional[str] = Query(default=None, description="Search by name or email"),
    status: Optional[StaffStatus] = Query(default=None, description="Filter by status"),
    role: Optional[str] = Query(default=None, description="Filter by role"),
    department: Optional[str] = Query(default=None, description="Filter by department"),
) -> list[Staff]:
    """List all staff members with optional search and filter parameters."""
    results = list(_staff_db)

    if search:
        search_lower = search.lower()
        results = [
            s for s in results
            if search_lower in s.name.lower() or search_lower in s.email.lower()
        ]

    if status is not None:
        results = [s for s in results if s.status == status]

    if role:
        role_lower = role.lower()
        results = [s for s in results if role_lower in s.role.lower()]

    if department:
        dept_lower = department.lower()
        results = [s for s in results if dept_lower in s.department.lower()]

    return results


@router.get("/{staff_id}", response_model=Staff)
def get_staff(staff_id: UUID) -> Staff:
    """Get a single staff member by ID."""
    for member in _staff_db:
        if member.id == staff_id:
            return member
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Staff member with id {staff_id} not found",
    )


@router.post("", response_model=Staff, status_code=status.HTTP_201_CREATED)
def create_staff(staff_in: StaffCreate) -> Staff:
    """Create a new staff member."""
    # Check for duplicate email
    for member in _staff_db:
        if member.email == staff_in.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Staff member with email {staff_in.email} already exists",
            )

    new_staff = Staff(id=uuid4(), **staff_in.model_dump())
    _staff_db.append(new_staff)
    return new_staff


@router.put("/{staff_id}", response_model=Staff)
def update_staff(staff_id: UUID, staff_in: StaffUpdate) -> Staff:
    """Update an existing staff member."""
    for idx, member in enumerate(_staff_db):
        if member.id == staff_id:
            update_data = staff_in.model_dump(exclude_unset=True)
            updated = member.model_copy(update=update_data)
            _staff_db[idx] = updated
            return updated
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Staff member with id {staff_id} not found",
    )


@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff(staff_id: UUID) -> None:
    """Delete a staff member."""
    for idx, member in enumerate(_staff_db):
        if member.id == staff_id:
            _staff_db.pop(idx)
            return
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Staff member with id {staff_id} not found",
    )
