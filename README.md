# Health Check API

A FastAPI application providing a health check endpoint.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

## Test

```bash
pytest
```

## Endpoint

### GET /api/health

Returns the current health status of the application.

**Response (200 OK):**

```json
{
  "status": "ok",
  "timestamp": "2026-04-05T12:00:00+00:00"
}
```

- `status` (string): Always `"ok"` when the service is healthy.
- `timestamp` (string): Current UTC time in ISO 8601 format.
