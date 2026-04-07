#!/bin/bash
# Start the development stack with Docker Compose
# This script sets up environment variables and starts both frontend and backend services

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Function to print colored messages
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Change to project root
cd "$PROJECT_ROOT"

log_info "Starting AI Sandbox development stack..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker first."
    exit 1
fi

log_info "Docker is available"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    log_warning "docker-compose command not found, trying docker compose..."
    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    DOCKER_COMPOSE_CMD="docker compose"
else
    DOCKER_COMPOSE_CMD="docker-compose"
fi

log_info "Using Docker Compose command: $DOCKER_COMPOSE_CMD"

# Load or create .env file
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    log_warning ".env file not found. Creating from .env.example..."
    if [ -f "$PROJECT_ROOT/.env.example" ]; then
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
        log_success ".env file created from .env.example"
    else
        log_error ".env.example not found"
        exit 1
    fi
fi

log_info "Environment variables loaded"

# Create data directory for database persistence
mkdir -p "$PROJECT_ROOT/data"
log_info "Data directory prepared"

# Pull latest images (optional, speeds up subsequent runs)
log_info "Pulling latest images..."
$DOCKER_COMPOSE_CMD pull --quiet || log_warning "Could not pull images (may be offline)"

# Build images
log_info "Building Docker images..."
$DOCKER_COMPOSE_CMD build --no-cache

log_success "Docker images built successfully"

# Stop any existing containers
log_info "Cleaning up existing containers..."
$DOCKER_COMPOSE_CMD down --remove-orphans || true

# Start services
log_info "Starting services..."
$DOCKER_COMPOSE_CMD up -d

log_success "Services started successfully"

# Wait for services to be healthy
log_info "Waiting for services to be healthy..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if $DOCKER_COMPOSE_CMD ps | grep -q "healthy"; then
        log_success "Services are healthy and running"
        break
    fi
    attempt=$((attempt + 1))
    sleep 1
done

if [ $attempt -eq $max_attempts ]; then
    log_warning "Services did not become healthy within timeout. Check logs with: $DOCKER_COMPOSE_CMD logs"
fi

# Display service information
log_info "=== AI Sandbox Development Stack ==="
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:3001"
echo "API Docs:  http://localhost:3001/docs"
echo ""
echo "Useful commands:"
echo "  View logs:           $DOCKER_COMPOSE_CMD logs -f"
echo "  Stop services:       $DOCKER_COMPOSE_CMD down"
echo "  Restart services:    $DOCKER_COMPOSE_CMD restart"
echo "  Rebuild images:      $DOCKER_COMPOSE_CMD build"
echo ""

log_success "Development stack is ready!"
