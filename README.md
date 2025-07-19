# Texas Poker Application

A full-stack poker application with range analysis and visualization tools.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Ultron API    │    │   PostgreSQL    │
│   (Quickview)   │◄──►│   (NestJS)      │◄──►│   (Supabase)    │
│   React + TS    │    │   Auth/Users    │    │   User Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         │             ┌─────────────────┐    ┌─────────────────┐
         └────────────►│   Vision API    │◄──►│   MongoDB Atlas │
                       │   (Spring Boot) │    │   (Free Tier)   │
                       │   Range Data    │    │   Range Data    │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- AWS CLI configured
- Terraform installed

### Local Development

```bash
# Start all services
docker-compose up

# Access applications
Frontend: http://localhost:8080
Ultron API: http://localhost:3000
Vision API: http://localhost:3001
```

```

## 📁 Project Structure

```

texas/
├── quickview/ # React frontend
├── ultron/ # NestJS backend
├── vision/ # Spring Boot API
├── infrastructure/ # Deployment & AWS config
│ ├── aws/ # Terraform files
│ ├── nginx/ # Reverse proxy config
│ └── deploy.sh # Deployment script
└── texas-sim/ # Go simulation engine

```

## 🔧 Environment Configuration

### Development

- Uses local Docker containers
- MongoDB: `mongodb:27017`
- PostgreSQL: `postgres:5432`

### Production

- AWS EC2 with Elastic IP
- MongoDB Atlas (Free Tier)
- Supabase PostgreSQL
- Nginx reverse proxy with SSL

## 📚 Documentation

- [Infrastructure Guide](infrastructure/README.md) - Detailed AWS setup
- [API Documentation](ultron/README.md) - Backend API docs

## 🛠️ Technologies

- **Frontend**: React, TypeScript, Webpack
- **Backend**: NestJS, Spring Boot
- **Database**: PostgreSQL (Supabase), MongoDB Atlas
- **Infrastructure**: AWS EC2, Terraform, Docker
- **Reverse Proxy**: Nginx with SSL

## 🔐 Security

- SSL certificates via Let's Encrypt (manual renewal)
- JWT authentication
- CORS properly configured
- Environment variables for secrets

## 📊 Monitoring

- Application logs via Docker
- Health check endpoints available
- Nginx access and error logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with Docker
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
```
