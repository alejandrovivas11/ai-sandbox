"""Tests for the staff CRUD operations."""

import datetime

from app.crud.staff import (
    create_staff,
    delete_staff,
    get_staff,
    get_staff_by_email,
    get_staff_by_id,
    update_staff,
)
from app.schemas.staff import StaffCreate, StaffUpdate


def _make_staff(db, email="alice@example.com", name="Alice Johnson"):
    """Helper to create a staff member in the database."""
    staff_data = StaffCreate(
        name=name,
        email=email,
        role="Engineer",
        team="Backend",
        status="active",
        hire_date=datetime.date(2024, 1, 15),
    )
    return create_staff(db, staff_data)


class TestCreateStaff:
    """Tests for the create_staff CRUD function."""

    def test_create_staff(self, db, sample_staff_create):
        result = create_staff(db, sample_staff_create)
        assert result.id is not None
        assert result.name == "Alice Johnson"
        assert result.email == "alice@example.com"
        assert result.role == "Engineer"
        assert result.team == "Backend"
        assert result.status == "active"
        assert result.hire_date == datetime.date(2024, 1, 15)
        assert result.created_at is not None
        assert result.updated_at is not None


class TestGetStaff:
    """Tests for the get_staff CRUD function."""

    def test_get_staff_empty(self, db):
        results = get_staff(db)
        assert results == []

    def test_get_staff_returns_all(self, db):
        _make_staff(db, email="a@example.com", name="A")
        _make_staff(db, email="b@example.com", name="B")
        results = get_staff(db)
        assert len(results) == 2

    def test_get_staff_filter_by_role(self, db):
        _make_staff(db, email="a@example.com")
        staff_b = StaffCreate(
            name="Bob",
            email="b@example.com",
            role="Manager",
            team="Backend",
            status="active",
            hire_date=datetime.date(2024, 2, 1),
        )
        create_staff(db, staff_b)

        results = get_staff(db, role="Manager")
        assert len(results) == 1
        assert results[0].role == "Manager"

    def test_get_staff_filter_by_team(self, db):
        _make_staff(db, email="a@example.com")
        results = get_staff(db, team="Backend")
        assert len(results) == 1
        results = get_staff(db, team="Frontend")
        assert len(results) == 0

    def test_get_staff_filter_by_status(self, db):
        _make_staff(db, email="a@example.com")
        results = get_staff(db, status="active")
        assert len(results) == 1
        results = get_staff(db, status="inactive")
        assert len(results) == 0

    def test_get_staff_search_by_name(self, db):
        _make_staff(db, email="a@example.com", name="Alice Johnson")
        results = get_staff(db, search="Alice")
        assert len(results) == 1
        results = get_staff(db, search="Nonexistent")
        assert len(results) == 0

    def test_get_staff_search_by_email(self, db):
        _make_staff(db, email="alice@example.com")
        results = get_staff(db, search="alice@")
        assert len(results) == 1

    def test_get_staff_pagination(self, db):
        for i in range(5):
            _make_staff(db, email=f"user{i}@example.com", name=f"User {i}")
        results = get_staff(db, skip=0, limit=2)
        assert len(results) == 2
        results = get_staff(db, skip=3, limit=10)
        assert len(results) == 2


class TestGetStaffById:
    """Tests for the get_staff_by_id CRUD function."""

    def test_get_existing_staff(self, db):
        created = _make_staff(db)
        result = get_staff_by_id(db, created.id)
        assert result is not None
        assert result.id == created.id

    def test_get_nonexistent_staff(self, db):
        result = get_staff_by_id(db, 9999)
        assert result is None


class TestGetStaffByEmail:
    """Tests for the get_staff_by_email CRUD function."""

    def test_get_existing_email(self, db):
        _make_staff(db, email="test@example.com")
        result = get_staff_by_email(db, "test@example.com")
        assert result is not None
        assert result.email == "test@example.com"

    def test_get_nonexistent_email(self, db):
        result = get_staff_by_email(db, "nobody@example.com")
        assert result is None


class TestUpdateStaff:
    """Tests for the update_staff CRUD function."""

    def test_update_existing_staff(self, db):
        created = _make_staff(db)
        update_data = StaffUpdate(name="Alice Updated", role="Senior Engineer")
        result = update_staff(db, created.id, update_data)
        assert result is not None
        assert result.name == "Alice Updated"
        assert result.role == "Senior Engineer"
        # Unchanged fields
        assert result.email == "alice@example.com"
        assert result.team == "Backend"

    def test_update_nonexistent_staff(self, db):
        update_data = StaffUpdate(name="Ghost")
        result = update_staff(db, 9999, update_data)
        assert result is None

    def test_update_partial_fields(self, db):
        created = _make_staff(db)
        update_data = StaffUpdate(status="inactive")
        result = update_staff(db, created.id, update_data)
        assert result is not None
        assert result.status == "inactive"
        assert result.name == "Alice Johnson"  # unchanged


class TestDeleteStaff:
    """Tests for the delete_staff CRUD function."""

    def test_delete_existing_staff(self, db):
        created = _make_staff(db)
        result = delete_staff(db, created.id)
        assert result is True
        # Verify it's gone
        assert get_staff_by_id(db, created.id) is None

    def test_delete_nonexistent_staff(self, db):
        result = delete_staff(db, 9999)
        assert result is False
