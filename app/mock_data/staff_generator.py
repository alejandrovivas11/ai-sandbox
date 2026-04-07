import logging
from faker import Faker
from app.schemas.staff import StaffCreate

logger = logging.getLogger(__name__)

fake = Faker()

HEALTHCARE_ROLES = [
    "Nurse",
    "Doctor",
    "Surgeon",
    "Pharmacist",
    "Therapist",
    "Technician",
    "Administrator",
    "Receptionist",
    "Lab Analyst",
    "Radiologist",
]

HEALTHCARE_TEAMS = [
    "Emergency",
    "Cardiology",
    "Oncology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
    "Radiology",
    "Pharmacy",
    "Administration",
    "Laboratory",
]

STAFF_STATUSES = ["active", "inactive", "on_leave"]


def generate_staff_data(count: int = 10) -> list[StaffCreate]:
    """Generate a list of realistic healthcare staff data using Faker."""
    staff_list = []
    used_emails: set[str] = set()

    for _ in range(count):
        email = fake.unique.email()
        while email in used_emails:
            email = fake.unique.email()
        used_emails.add(email)

        staff = StaffCreate(
            name=fake.name(),
            email=email,
            role=fake.random_element(HEALTHCARE_ROLES),
            team=fake.random_element(HEALTHCARE_TEAMS),
            status=fake.random_element(STAFF_STATUSES),
            hire_date=fake.date_between(start_date="-5y", end_date="today"),
        )
        staff_list.append(staff)

    return staff_list
