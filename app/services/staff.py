import logging
from typing import Optional

from sqlalchemy.orm import Session

from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffUpdate

logger = logging.getLogger(__name__)


class StaffService:
    """Service layer for staff CRUD operations."""

    def __init__(self, db: Session):
        self.db = db

    def get_all_staff(
        self,
        search: Optional[str] = None,
        role_filter: Optional[str] = None,
        department_filter: Optional[str] = None,
    ) -> list[Staff]:
        """Retrieve all staff with optional search and filters."""
        query = self.db.query(Staff)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                Staff.name.ilike(search_term)
                | Staff.email.ilike(search_term)
            )

        if role_filter:
            query = query.filter(Staff.role == role_filter)

        if department_filter:
            query = query.filter(Staff.department == department_filter)

        results = query.all()
        logger.info("Retrieved %d staff members", len(results))
        return results

    def get_staff_by_id(self, staff_id: int) -> Optional[Staff]:
        """Retrieve a single staff member by ID."""
        return self.db.query(Staff).filter(Staff.id == staff_id).first()

    def create_staff(self, data: StaffCreate) -> Staff:
        """Create a new staff member."""
        staff = Staff(**data.model_dump())
        self.db.add(staff)
        self.db.commit()
        self.db.refresh(staff)
        logger.info("Created staff member: %s (id=%d)", staff.name, staff.id)
        return staff

    def update_staff(self, staff_id: int, data: StaffUpdate) -> Optional[Staff]:
        """Update an existing staff member. Returns None if not found."""
        staff = self.db.query(Staff).filter(Staff.id == staff_id).first()
        if not staff:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(staff, field, value)

        self.db.commit()
        self.db.refresh(staff)
        logger.info("Updated staff member: %s (id=%d)", staff.name, staff.id)
        return staff
