# Texas Poker Analysis Platform

This repository contains a full-stack poker analysis platform with multiple services:

- **Quickview**: Frontend application (React/TypeScript)
- **Ultron**: Main backend service (NestJS)
- **Vision**: Poker range analysis service (Java Spring Boot)
- **Texas-sim**: Poker game simulator (Go)

## Prerequisites

- Docker
- Docker Compose

## Running the Services

1. Clone the repository:
```bash
git clone <repository-url>
cd texas
```

2. Build and start all services:
```bash
docker-compose up --build
```

This will start all services and make them available at:
- Quickview frontend: http://localhost:8080
- Ultron API: http://localhost:3000
- Vision API: http://localhost:3001

## Services Overview

### Quickview (Frontend)
- Port: 8080
- React/TypeScript application
- Connects to Ultron and Vision services

### Ultron (Backend)
- Port: 3000
- NestJS application
- Handles user authentication and core services
- Uses PostgreSQL database

### Vision (Range Analysis)
- Port: 3001
- Java Spring Boot application
- Manages poker ranges
- Uses MongoDB database

### Texas-sim (Game Simulator)
- Go application
- Simulates Texas Hold'em poker games

## Stopping the Services

To stop all services:
```bash
docker-compose down
```

To stop and remove volumes:
```bash
docker-compose down -v
``` 