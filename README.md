# AI Sandbox

A minimal FastAPI + Next.js application used as a target repository for the AI Engineering System.

## How to Run with Docker

### Prerequisites
- Docker and Docker Compose installed

### Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Build and start all services
docker-compose up --build

# 3. Access the application
# Frontend: http://localhost:3002
# Backend API: http://localhost:3001
# API Docs: http://localhost:3001/docs
```

### Docker Commands

```bash
# Start services (detached mode)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# Run only backend
docker-compose up backend

# Run only frontend
docker-compose up frontend
```

### Port Configuration

If default ports are in use, modify `.env`:

```bash
BACKEND_PORT=3001   # Change if 3001 is busy
FRONTEND_PORT=3002  # Change if 3002 is busy
```

## Run Locally (without Docker)

### Backend

```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 3001
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## Project Structure

```
ai-sandbox/
├── app/                 # FastAPI backend
├── alembic/             # Database migrations
├── frontend/            # Next.js frontend
├── docker-compose.yml   # Docker orchestration
├── Dockerfile           # Backend container
└── .env.example         # Environment template
```

## Purpose

This repo exists so the AI Engineering System can:

- Clone it
- Create branches
- Make code changes
- Open PRs

Do not add complex logic here. Keep it minimal.
