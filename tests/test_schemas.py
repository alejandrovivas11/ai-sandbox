"""Tests for Pydantic schema validation."""

import datetime

import pytest
from pydantic import ValidationError

from app.schemas.staff import StaffCreate, StaffResponse, StaffUpdate


class TestStaffCreate:
    """Tests for the StaffCreate schema."""

    def test_valid_staff_create(self):
        staff = StaffCreate(
            name="Alice Johnson",
            email="alice@example.com",
            role="Engineer",
            team="Backend",
            hire_date=datetime.date(2024, 1, 15),
        )
        assert staff.name == "Alice Johnson"
        assert staff.status == "active"  # default value

    def test_staff_create_with_explicit_status(self):
        staff = StaffCreate(
            name="Bob",
            email="bob@example.com",
            role="Manager",
            team="Frontend",
            status="inactive",
            hire_date=datetime.date(2024, 6, 1),
        )
        assert staff.status == "inactive"

    def test_staff_create_missing_required_field(self):
        with pytest.raises(ValidationError):
            StaffCreate(
                name="Alice",
                email="alice@example.com",
                # missing role, team, hire_date
            )

    def test_staff_create_date_string_coercion(self):
        staff = StaffCreate(
            name="Alice",
            email="alice@example.com",
            role="Engineer",
            team="Backend",
            hire_date="2024-01-15",
        )
        assert staff.hire_date == datetime.date(2024, 1, 15)


class TestStaffUpdate:
    """Tests for the StaffUpdate schema."""

    def test_all_fields_optional(self):
        update = StaffUpdate()
        dump = update.model_dump(exclude_unset=True)
        assert dump == {}

    def test_partial_update(self):
        update = StaffUpdate(name="Updated Name")
        dump = update.model_dump(exclude_unset=True)
        assert dump == {"name": "Updated Name"}

    def test_full_update(self):
        update = StaffUpdate(
            name="Updated",
            email="updated@example.com",
            role="Manager",
            team="Frontend",
            status="inactive",
            hire_date=datetime.date(2025, 1, 1),
        )
        dump = update.model_dump(exclude_unset=True)
        assert len(dump) == 6


class TestStaffResponse:
    """Tests for the StaffResponse schema."""

    def test_staff_response_from_attributes(self):
        now = datetime.datetime(2024, 1, 15, 12, 0, 0)

        class FakeStaff:
            id = 1
            name = "Alice"
            email = "alice@example.com"
            role = "Engineer"
            team = "Backend"
            status = "active"
            hire_date = datetime.date(2024, 1, 15)
            created_at = now
            updated_at = now

        resp = StaffResponse.model_validate(FakeStaff())
        assert resp.id == 1
        assert resp.name == "Alice"
        assert resp.created_at == now
