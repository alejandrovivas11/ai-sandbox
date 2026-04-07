# AI Sandbox

A FastAPI application providing a staff management API, used as a target repository for the AI Engineering System.

## Setup and Installation

### Prerequisites

- Python 3.11+
- pip

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run locally

```bash
uvicorn app.main:app --reload --port 8001
```

The API will be available at `http://localhost:8001`.

### Run tests

```bash
pytest
```

## Staff Management API

The application provides a full CRUD API for managing staff members in a healthcare organization. Staff records include personal information, role assignments, team membership, and employment status.

### Data Model

Each staff member has the following fields:

| Field        | Type     | Required | Description                                      |
|-------------|----------|----------|--------------------------------------------------|
| id          | integer  | auto     | Unique identifier (auto-generated)               |
| name        | string   | yes      | Full name                                        |
| email       | string   | yes      | Email address (must be unique)                   |
| role        | string   | yes      | Job title (e.g., Nurse, Doctor, Surgeon)         |
| team        | string   | yes      | Department (e.g., Cardiology, Emergency)         |
| status      | string   | no       | Employment status: active, inactive, or on_leave (default: active) |
| hire_date   | date     | yes      | Employment start date (ISO 8601 format)          |
| created_at  | datetime | auto     | Record creation timestamp                        |
| updated_at  | datetime | auto     | Record last-modified timestamp                   |

### Endpoints

#### Health Check

```
GET /
```

Returns a status message confirming the service is running.

**Response (200):**

```json
{
  "message": "AI Sandbox is running"
}
```

#### List Staff

```
GET /staff
```

Returns a list of staff members with optional filtering, search, and pagination.

**Query Parameters:**

| Parameter | Type   | Default | Description                                |
|-----------|--------|---------|--------------------------------------------|
| skip      | int    | 0       | Number of records to skip (offset)         |
| limit     | int    | 100     | Maximum records to return (1--1000)        |
| role      | string | --      | Filter by role (exact match)               |
| team      | string | --      | Filter by team (exact match)               |
| status    | string | --      | Filter by status (exact match)             |
| search    | string | --      | Search name or email (case-insensitive)    |

**Example request:**

```bash
curl "http://localhost:8001/staff?role=Nurse&team=Cardiology&skip=0&limit=10"
```

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "Nurse",
    "team": "Cardiology",
    "status": "active",
    "hire_date": "2023-03-15",
    "created_at": "2025-01-10T08:30:00",
    "updated_at": "2025-01-10T08:30:00"
  }
]
```

#### Create Staff Member

```
POST /staff
```

Creates a new staff member. The email must be unique across all records.

**Request body:**

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "Nurse",
  "team": "Cardiology",
  "status": "active",
  "hire_date": "2023-03-15"
}
```

**Response (201):**

```json
{
  "id": 1,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "Nurse",
  "team": "Cardiology",
  "status": "active",
  "hire_date": "2023-03-15",
  "created_at": "2025-01-10T08:30:00",
  "updated_at": "2025-01-10T08:30:00"
}
```

**Error (400) -- duplicate email:**

```json
{
  "detail": "Email already registered"
}
```

#### Get Staff Member

```
GET /staff/{staff_id}
```

Returns a single staff member by ID.

**Example request:**

```bash
curl http://localhost:8001/staff/1
```

**Response (200):** Same shape as the create response above.

**Error (404):**

```json
{
  "detail": "Staff member not found"
}
```

#### Update Staff Member

```
PUT /staff/{staff_id}
```

Updates one or more fields on an existing staff member. All fields are optional; only the provided fields are changed.

**Example request (partial update):**

```bash
curl -X PUT http://localhost:8001/staff/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "on_leave"}'
```

**Response (200):** Returns the full updated staff record.

**Error (404):**

```json
{
  "detail": "Staff member not found"
}
```

#### Delete Staff Member

```
DELETE /staff/{staff_id}
```

Permanently removes a staff member.

**Example request:**

```bash
curl -X DELETE http://localhost:8001/staff/1
```

**Response:** 204 No Content (empty body).

**Error (404):**

```json
{
  "detail": "Staff member not found"
}
```

#### Generate Mock Data

```
POST /generate-mock-data
```

Populates the database with randomly generated healthcare staff records using the Faker library.

**Query Parameters:**

| Parameter | Type | Default | Description                     |
|-----------|------|---------|---------------------------------|
| count     | int  | 10      | Number of records to generate   |

**Example request:**

```bash
curl -X POST "http://localhost:8001/generate-mock-data?count=5"
```

**Response (200):**

```json
{
  "message": "Generated 5 mock staff members",
  "ids": [1, 2, 3, 4, 5]
}
```

Generated records use realistic healthcare data including roles (Nurse, Doctor, Surgeon, Pharmacist, Therapist, Technician, Administrator, Receptionist, Lab Analyst, Radiologist) and teams (Emergency, Cardiology, Oncology, Pediatrics, Neurology, Orthopedics, Radiology, Pharmacy, Administration, Laboratory).

## Project Structure

```
app/
  __init__.py
  main.py                    # FastAPI application entry point
  database.py                # SQLAlchemy engine and session configuration
  models/
    __init__.py
    staff.py                 # Staff SQLAlchemy ORM model
  schemas/
    __init__.py
    staff.py                 # Pydantic request/response schemas
  routers/
    __init__.py
    staff.py                 # API route handlers
  crud/
    __init__.py
    staff.py                 # Database query functions
  mock_data/
    __init__.py
    staff_generator.py       # Faker-based test data generator
tests/
  __init__.py
  conftest.py                # Pytest fixtures (in-memory DB, test client)
  test_staff_api.py          # API endpoint integration tests
  test_staff_crud.py         # CRUD operation unit tests
  test_schemas.py            # Pydantic schema validation tests
```

## Technical Details

- **Framework:** FastAPI 0.109.0
- **ORM:** SQLAlchemy 2.0.25
- **Database:** SQLite (file-based, `./staff.db`)
- **Validation:** Pydantic v2 with `from_attributes` for ORM model conversion
- **Migrations:** Alembic 1.13.1
- **Test data:** Faker 22.5.0
- **Testing:** pytest with httpx TestClient and in-memory SQLite
- **CORS:** Enabled for all origins (development configuration)

## Purpose

This repo exists so the AI Engineering System can:

- Clone it
- Create branches
- Make code changes
- Open PRs
