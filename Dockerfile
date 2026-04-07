# Simple single-stage Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./app ./app
COPY ./alembic ./alembic
COPY ./alembic.ini .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DATABASE_URL=sqlite:///./data/staff.db

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3001"]
