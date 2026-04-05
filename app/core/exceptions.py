"""
Custom exception classes and FastAPI exception handlers.
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class NotFoundException(Exception):
    """Raised when a requested resource is not found."""

    def __init__(self, detail: str = "Resource not found") -> None:
        self.detail = detail
        self.status_code = 404


class ConflictException(Exception):
    """Raised when a resource conflict occurs."""

    def __init__(self, detail: str = "Resource conflict") -> None:
        self.detail = detail
        self.status_code = 409


class ValidationException(Exception):
    """Raised when a validation rule is violated."""

    def __init__(self, detail: str = "Validation error") -> None:
        self.detail = detail
        self.status_code = 400


class AuthenticationException(Exception):
    """Raised when authentication fails."""

    def __init__(self, detail: str = "Authentication failed") -> None:
        self.detail = detail
        self.status_code = 401


async def not_found_handler(request: Request, exc: NotFoundException) -> JSONResponse:
    """Handle NotFoundException."""
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


async def conflict_handler(request: Request, exc: ConflictException) -> JSONResponse:
    """Handle ConflictException."""
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


async def validation_handler(request: Request, exc: ValidationException) -> JSONResponse:
    """Handle ValidationException."""
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


async def authentication_handler(
    request: Request, exc: AuthenticationException
) -> JSONResponse:
    """Handle AuthenticationException."""
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


def register_exception_handlers(app: FastAPI) -> None:
    """Register all custom exception handlers on the FastAPI app."""
    app.add_exception_handler(NotFoundException, not_found_handler)
    app.add_exception_handler(ConflictException, conflict_handler)
    app.add_exception_handler(ValidationException, validation_handler)
    app.add_exception_handler(AuthenticationException, authentication_handler)
