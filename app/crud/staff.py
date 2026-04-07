import logging
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffUpdate

logger = logging.getLogger(__name__)


def get_staff(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    team: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
) -> list[Staff]:
    """Get a list of staff with optional filtering and search."""
    query = db.query(Staff)

    if role:
        query = query.filter(Staff.role == role)
    if team:
        query = query.filter(Staff.team == team)
    if status:
        query = query.filter(Staff.status == status)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Staff.name.ilike(search_term),
                Staff.email.ilike(search_term),
            )
        )

    return query.offset(skip).limit(limit).all()


def get_staff_by_id(db: Session, staff_id: int) -> Optional[Staff]:
    """Get a single staff member by ID."""
    return db.query(Staff).filter(Staff.id == staff_id).first()


def get_staff_by_email(db: Session, email: str) -> Optional[Staff]:
    """Get a single staff member by email."""
    return db.query(Staff).filter(Staff.email == email).first()


def create_staff(db: Session, staff: StaffCreate) -> Staff:
    """Create a new staff member."""
    db_staff = Staff(**staff.model_dump())
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff


def update_staff(
    db: Session, staff_id: int, staff_update: StaffUpdate
) -> Optional[Staff]:
    """Update an existing staff member."""
    db_staff = get_staff_by_id(db, staff_id)
    if db_staff is None:
        return None

    update_data = staff_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_staff, field, value)

    db.commit()
    db.refresh(db_staff)
    return db_staff


def delete_staff(db: Session, staff_id: int) -> bool:
    """Delete a staff member. Returns True if deleted, False if not found."""
    db_staff = get_staff_by_id(db, staff_id)
    if db_staff is None:
        return False

    db.delete(db_staff)
    db.commit()
    return True
