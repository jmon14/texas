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
# Ultron API: http://localhost:3000
# Vision API: http://localhost:3001
```

**New to the project?** See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup and development workflow.

## 🏗️ Architecture

```
├── quickview/     # React frontend (TypeScript + Material-UI)
├── ultron/        # NestJS authentication API (PostgreSQL)
├── vision/        # Spring Boot range analysis API (MongoDB)
└── infrastructure/ # AWS deployment configuration
```

**Frontend** → **Authentication API** → **PostgreSQL**  
**Frontend** → **Range Analysis API** → **MongoDB**

## 📚 Documentation

- **[Contributing Guide](CONTRIBUTING.md)** - Development setup, workflow, and standards
- **[System Architecture](docs/architecture.md)** - Technical design and component interactions  
- **[Infrastructure Guide](infrastructure/README.md)** - Production deployment on AWS
- **[Troubleshooting Guide](docs/troubleshooting.md)** - Common issues and solutions

### Service-Specific Documentation
- [Frontend (quickview/)](quickview/README.md) - React app architecture
- [Authentication API (ultron/)](ultron/README.md) - NestJS backend service  
- [Range Analysis API (vision/)](vision/README.md) - Spring Boot service

### API Documentation
- [Ultron API](http://localhost:3000/api) - Interactive Swagger docs
- [Vision API](http://localhost:3001/v3/api-docs) - OpenAPI specification

## 🛠️ Tech Stack

**Frontend**: React + TypeScript + Material-UI + Redux Toolkit  
**APIs**: NestJS + Spring Boot  
**Databases**: PostgreSQL (Supabase) + MongoDB Atlas  
**Infrastructure**: AWS + Docker + Terraform  

## 📄 License

MIT License
