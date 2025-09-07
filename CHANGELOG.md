# Changelog

All notable changes to the Texas Poker application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation structure with CONTRIBUTING.md and CHANGELOG.md
- Enhanced README files with better navigation and structure
- CLAUDE.md development guide for future Claude Code instances

### Changed
- Fixed project structure representation in main README.md
- Improved documentation navigation with clear service descriptions

## [1.0.0] - Current Release

### Added

#### Frontend (Quickview)
- React-based poker range analysis interface
- Material-UI component library with dark/light theme support
- Redux Toolkit state management
- Interactive 13x13 poker hand range builder
- File upload functionality with drag & drop support
- User authentication with JWT token management
- Automatic API client generation from OpenAPI specs
- Storybook component development environment
- Comprehensive test suite with Jest and React Testing Library

#### Backend (Ultron)
- NestJS authentication and user management service
- JWT-based authentication with refresh token support
- PostgreSQL database with TypeORM
- User registration with email verification
- Password reset functionality
- File upload to AWS S3
- Swagger/OpenAPI documentation
- Health check endpoints
- Comprehensive test coverage

#### Vision API
- Spring Boot poker range analysis service
- MongoDB integration for flexible range storage
- RESTful API for range CRUD operations
- User-specific range isolation
- Input validation and error handling
- OpenAPI documentation with Swagger UI
- Docker containerization

#### Infrastructure
- AWS EC2 deployment with Terraform
- Route53 DNS management
- S3 bucket for file storage
- ECR container registry
- IAM roles and policies
- Security groups and networking
- Nginx reverse proxy with SSL termination
- Automated deployment script
- GitHub Actions CI/CD integration
- Docker Compose setup for local development
- SSL certificate automation with Let's Encrypt
- ECR integration for containerized deployments

### Database
- PostgreSQL (Supabase) for user data and authentication
- MongoDB Atlas (free tier) for poker range data
- Database migrations and schema management
- Connection pooling and optimization

### Security
- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- CORS configuration
- Security headers with Helmet
- Input validation and sanitization
- Environment-based configuration
- AWS IAM least-privilege access

### Development Experience
- Docker Compose for local development
- Hot reload for all services
- ESLint and Prettier configuration
- TypeScript strict mode
- Automated testing pipelines
- Code quality tools and standards

### Deployment
- Production-ready Docker containers
- AWS infrastructure as code
- Automated SSL certificate management
- Health monitoring and logging
- Environment-specific configurations
- CI/CD pipeline with GitHub Actions
