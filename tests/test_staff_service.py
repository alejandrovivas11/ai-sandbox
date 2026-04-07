"""Tests for StaffService business logic."""

from datetime import datetime

from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffUpdate
from app.services.staff import StaffService


class TestStaffServiceGetAll:
    def test_empty(self, db_session):
        service = StaffService(db_session)
        result = service.get_all_staff()
        assert result == []

    def test_returns_all(self, db_session):
        db_session.add(Staff(name="A", role="R", department="D", email="a@t.com", status="Active"))
        db_session.add(Staff(name="B", role="R", department="D", email="b@t.com", status="Active"))
        db_session.commit()
        service = StaffService(db_session)
        assert len(service.get_all_staff()) == 2

    def test_search_filters_name(self, db_session):
        db_session.add(Staff(name="Sarah Chen", role="R", department="D", email="s@t.com", status="Active"))
        db_session.add(Staff(name="James Rod", role="R", department="D", email="j@t.com", status="Active"))
        db_session.commit()
        service = StaffService(db_session)
        result = service.get_all_staff(search="sarah")
        assert len(result) == 1
        assert result[0].name == "Sarah Chen"

    def test_search_filters_email(self, db_session):
        db_session.add(Staff(name="A", role="R", department="D", email="unique@t.com", status="Active"))
        db_session.add(Staff(name="B", role="R", department="D", email="other@t.com", status="Active"))
        db_session.commit()
        service = StaffService(db_session)
        result = service.get_all_staff(search="unique")
        assert len(result) == 1

    def test_role_filter(self, db_session):
        db_session.add(Staff(name="A", role="Physician", department="D", email="a@t.com", status="Active"))
        db_session.add(Staff(name="B", role="Nurse", department="D", email="b@t.com", status="Active"))
        db_session.commit()
        service = StaffService(db_session)
        result = service.get_all_staff(role_filter="Physician")
        assert len(result) == 1
        assert result[0].role == "Physician"

    def test_department_filter(self, db_session):
        db_session.add(Staff(name="A", role="R", department="ER", email="a@t.com", status="Active"))
        db_session.add(Staff(name="B", role="R", department="Surgery", email="b@t.com", status="Active"))
        db_session.commit()
        service = StaffService(db_session)
        result = service.get_all_staff(department_filter="ER")
        assert len(result) == 1


class TestStaffServiceGetById:
    def test_found(self, db_session):
        staff = Staff(name="A", role="R", department="D", email="a@t.com", status="Active")
        db_session.add(staff)
        db_session.commit()
        service = StaffService(db_session)
        result = service.get_staff_by_id(staff.id)
        assert result is not None
        assert result.name == "A"

    def test_not_found(self, db_session):
        service = StaffService(db_session)
        assert service.get_staff_by_id(999) is None


class TestStaffServiceCreate:
    def test_create(self, db_session):
        service = StaffService(db_session)
        data = StaffCreate(
            name="New Staff",
            role="Physician",
            department="Cardiology",
            email="new@t.com",
            phone="(555) 111-2222",
            status="Active",
            hireDate=datetime(2023, 6, 1),
        )
        result = service.create_staff(data)
        assert result.id is not None
        assert result.name == "New Staff"
        assert result.hireDate == datetime(2023, 6, 1)


class TestStaffServiceUpdate:
    def test_update(self, db_session):
        staff = Staff(name="Old", role="R", department="D", email="o@t.com", status="Active")
        db_session.add(staff)
        db_session.commit()
        service = StaffService(db_session)
        updated = service.update_staff(staff.id, StaffUpdate(name="New"))
        assert updated is not None
        assert updated.name == "New"
        assert updated.role == "R"

    def test_update_not_found(self, db_session):
        service = StaffService(db_session)
        result = service.update_staff(999, StaffUpdate(name="Ghost"))
        assert result is None
