# AI Sandbox

A minimal FastAPI application used as a target repository for the AI Engineering System.

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## How to Run with Docker

This project includes a complete Docker setup with automatic database migrations.

### Prerequisites

- Docker and Docker Compose installed
- `.env` file configured (copy from `.env.example`)

### Quick Start

1. Clone the repository and navigate to the project directory:

```bash
cd ai-sandbox
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Start all services with Docker Compose:

```bash
docker-compose up -d
```

This command will:
- Start PostgreSQL database
- Run Alembic migrations automatically (db-init service)
- Start FastAPI backend server
- Start Next.js frontend

4. Access the application:
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/docs
   - Frontend: http://localhost:3002

### Docker Service Architecture

- **postgres**: PostgreSQL 16 database with health checks
- **db-init**: Runs Alembic migrations before API starts
- **backend**: FastAPI application with uvicorn
- **frontend**: Next.js application

### Database Management

The db-init service automatically runs migrations on startup. To run migrations manually:

```bash
docker-compose exec backend alembic upgrade head
```

To create a new migration:

```bash
docker-compose exec backend alembic revision --autogenerate -m "migration message"
```

### Configuration

Environment variables are defined in `.env` file:

- `DATABASE_URL`: PostgreSQL connection string
- `POSTGRES_USER`, `POSTGRES_PASSWORD`: Database credentials
- `DEBUG`: Enable debug mode
- `LOG_LEVEL`: Logging level (INFO, DEBUG, WARNING, ERROR)
- `NEXT_PUBLIC_API_URL`: Frontend API endpoint

### Stopping Services

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

### Troubleshooting

**Migrations failed:**
- Check db-init logs: `docker-compose logs db-init`
- Verify DATABASE_URL in `.env` file
- Ensure postgres service is healthy: `docker-compose ps`

**Backend fails to connect to database:**
- Wait for postgres health check to pass
- Verify POSTGRES_USER and POSTGRES_PASSWORD match in `.env`
- Check backend logs: `docker-compose logs backend`

**Port conflicts:**
- Backend port: Configure `BACKEND_PORT` in `.env` (default: 3001)
- Frontend port: Modify in docker-compose.yml (default: 3002)
- Database port: Configure `POSTGRES_PORT` in `.env` (default: 5432)

**Clear everything and start fresh:**

```bash
docker-compose down -v
docker image prune -a
docker-compose build --no-cache
docker-compose up -d
```

## Purpose

This repo exists so the AI Engineering System can:

- Clone it
- Create branches
- Make code changes
- Open PRs

Do not add complex logic here. Keep it minimal.
