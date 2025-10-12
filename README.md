# Texas Poker Application

A full-stack poker application with range analysis and visualization tools, featuring an interactive range builder, user authentication, and file management.

## 🚀 Quick Start

```bash
# Clone and start all services
git clone <repository-url>
cd texas
docker-compose up

# Access applications
# Frontend: http://localhost:8080
# Backend API: http://localhost:3000
```

**New to the project?** See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup and development workflow.

## 🏗️ Architecture

```
├── apps/
│   ├── frontend/      # React frontend (TypeScript + Material-UI)
│   └── backend/       # NestJS API (PostgreSQL + MongoDB)
└── infrastructure/    # AWS deployment configuration
```

**Frontend** → **Backend API** → **PostgreSQL** (users, files)
**Frontend** → **Backend API** → **MongoDB** (ranges)

## 📚 Documentation

- **[Contributing Guide](CONTRIBUTING.md)** - Development setup, workflow, and standards
- **[System Architecture](docs/architecture.md)** - Technical design and component interactions
- **[Infrastructure Guide](infrastructure/README.md)** - Production deployment on AWS
- **[Troubleshooting Guide](docs/troubleshooting.md)** - Common issues and solutions

### Service-Specific Documentation
- [Frontend (apps/frontend/)](apps/frontend/README.md) - React app architecture
- [Backend API (apps/backend/)](apps/backend/README.md) - NestJS backend service

### API Documentation
- [Backend API](http://localhost:3000/api) - Interactive Swagger docs

## 🛠️ Tech Stack

**Frontend**: React + TypeScript + Material-UI + Redux Toolkit
**Backend**: NestJS + TypeScript
**Databases**: PostgreSQL (Supabase) + MongoDB Atlas
**Infrastructure**: AWS + Docker + Terraform  

## 📄 License

MIT License
