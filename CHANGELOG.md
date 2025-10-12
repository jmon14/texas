# Changelog

All notable changes to the Texas Poker application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-01-15

### Changed

#### Architecture Simplification
- **Service Consolidation**: Unified TypeScript stack with React frontend and NestJS backend
- **Service Renaming**: QuickView → Frontend, Ultron → Backend for clearer nomenclature
- **Directory Restructure**: Moved services to `apps/` folder (apps/frontend, apps/backend)
- **Environment Variables**: Renamed `REACT_APP_ULTRON_API_URL` → `REACT_APP_BACKEND_API_URL`
- **API Client Directory**: Renamed `ultron-api/` → `backend-api/`
- **ECR Repositories**: Renamed to texas-frontend and texas-backend
- **SSM Parameter Paths**: Updated from `/texas/ultron/*` to `/texas/backend/*`
- **Docker Services**: Updated service names in docker-compose configurations (frontend, backend)
- **CI/CD Pipeline**: Updated GitHub Actions workflows for new service names and paths

#### Backend Enhancement
- **MongoDB Integration**: Backend now handles both PostgreSQL (users/auth) and MongoDB (ranges)
- **Unified API**: Single NestJS service manages all application domains
- **Database Architecture**: Dual-database approach with PostgreSQL for relational data and MongoDB for flexible range structures
- **Range Management**: Migrated poker range functionality from Vision to Backend service

### Removed

#### Vision Service Deprecation
- **Spring Boot Service**: Removed Vision service (Java/Spring Boot)
- **Java Stack**: Eliminated Java/Maven dependencies from project
- **MongoDB Migration**: Range management now handled by Backend service
- **Microservice Consolidation**: Simplified from 3-service to 2-service architecture
- **ECR Cleanup**: Removed texas-vision repository
- **Infrastructure**: Removed Vision-related Terraform resources and deployment configurations

### Fixed
- **Documentation**: Updated all documentation to reflect new architecture
- **Configuration Service**: Fixed hardcoded SSM paths in Backend configuration (`/texas/ultron` → `/texas/backend`)
- **API References**: Updated API client generation commands (`openapi:ultron` → `openapi:backend`)
- **Database Names**: Updated database references (PostgreSQL: `ultron` → `backend`, MongoDB: `ultron` → `texas`)

### Breaking Changes
- **Service Names**: All references to "QuickView" and "Ultron" have been renamed
- **Environment Variables**: Frontend requires new `REACT_APP_BACKEND_API_URL` variable
- **API Clients**: Generated API client directory renamed from `ultron-api/` to `backend-api/`
- **Infrastructure**: ECR repository names changed (requires re-deployment)
- **SSM Parameters**: All parameter paths moved from `/texas/ultron/*` to `/texas/backend/*`

## [1.2.0] - 2025-09-14

### Added

#### Vision API Development Experience
- **Code Formatting**: Integrated Spotless plugin with Google Java Format for consistent code style
- **Code Linting**: Added Checkstyle plugin with Google's standard checks for code quality validation
- **Development Workflow**: Enhanced development experience with automated code formatting and linting tools
- **Build Integration**: Formatting and linting checks run automatically during Maven build process

### Changed
- **Development Standards**: Improved code quality consistency across the Vision service
- **Documentation**: Updated Vision README with code formatting and linting tool usage

## [1.1.0] - 2025-01-14

### Added

#### Vision API Development
- **Hot Reload**: Added development hot reload capability 
- **Enhanced Health Endpoints**: Improved health check responses

### Changed
- **Vision Development**: Added hot reload for faster development cycles
- **Health Endpoint Response**: Enhanced response format with timestamps

## [1.0.1] - Previous Release

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

#### Backend
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
