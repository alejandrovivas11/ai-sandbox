# AI Sandbox

This is a minimal FastAPI application used as a target for the AI Engineering System.

## Stack
- Python 3.11+
- FastAPI
- No database (yet)

## Project structure
```
app/
├── __init__.py    # Empty
└── main.py        # FastAPI app with routes
```

## How to run
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Code style
- Use type hints on all function signatures
- Use FastAPI dependency injection patterns
- Keep routes in app/main.py unless the file gets too large, then split into app/routes/
- Use pydantic BaseModel for request/response schemas
- Follow conventional commits for commit messages

## Testing
```bash
python -m pytest
```
No tests exist yet. When adding tests, use pytest and place them in a `tests/` directory.

## Important
- Do NOT add unnecessary dependencies
- Keep changes minimal and focused
- Every endpoint should return JSON
- Use HTTP status codes correctly
