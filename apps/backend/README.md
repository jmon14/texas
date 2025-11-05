# Backend API

A NestJS backend service for the Texas Poker application, providing a unified API for user management, authentication, file uploads, email notifications, and poker range analysis.

> **CI/CD**: Automatically built and deployed via GitHub Actions when backend changes are detected. Docker images are built fresh and deployed to production via Amazon ECR.

## 🏗️ Architecture Overview

The Backend is a **unified API service** responsible for:

- **User Authentication & Authorization** (JWT-based)
- **User Management** (registration, profile updates)
- **File Upload & Management** (AWS S3 integration)
- **Email Notifications** (verification, password reset via AWS SES)
- **Poker Range Management** (MongoDB-based range storage and analysis)

## 📁 Project Structure

```
apps/backend/
├── src/
│   ├── auth/             # Authentication & Authorization
│   │   ├── guards/       # JWT and Local auth guards
│   │   ├── strategies/   # Passport strategies
│   │   ├── interfaces/   # Request interfaces
│   │   └── auth.service.ts
│   ├── users/            # User Management
│   │   ├── dtos/         # Data Transfer Objects
│   │   ├── users.service.ts
│   │   └── users.controller.ts
│   ├── files/            # File Management
│   │   ├── files.service.ts
│   │   └── files.controller.ts
│   ├── ranges/           # Poker Range Management
│   │   ├── ranges.service.ts
│   │   └── ranges.controller.ts
│   ├── email/            # Email Service
│   │   ├── strategies/   # Email providers (SES, Ethereal)
│   │   └── email.service.ts
│   ├── database/         # Database Layer
│   │   ├── entities/     # TypeORM entities (PostgreSQL)
│   │   ├── schemas/      # Mongoose schemas (MongoDB)
│   │   ├── subscribers/  # Database event handlers
│   │   └── database.module.ts
│   ├── config/           # Configuration
│   │   ├── config.module.ts
│   │   └── configuration.service.ts
│   └── utils/            # Utilities
└── e2e/                 # E2E tests
```

## 🚀 Development

**For complete setup instructions, see [CONTRIBUTING.md](../../CONTRIBUTING.md)**

### Environment Configuration

Before running the Backend locally, you need to set up environment variables:

```bash
# Copy environment template
cp .development.env.example .development.env

# Edit .development.env with your values:
```

### Key Backend Commands

```bash
# Database operations
npm run migrate              # Run database migrations
npm run migrate:revert       # Revert last migration
npm run seed:scenarios       # Seed initial scenario data (15 tournament preflop scenarios)

# Testing
npm test                     # Unit tests
npm run test:e2e            # End-to-end tests
npm run test:cov            # Test coverage

# Development
npm run start:dev           # Development server with hot reload
npm run lint                # ESLint checking
```

### Database Seeding

The Backend includes a seeding system for populating initial scenario data:

**Seed Scenarios:**
```bash
npm run seed:scenarios
```

This command:
- Loads 15 tournament preflop scenarios from `src/seeders/data/scenarios.json`
- Creates scenarios via the `ScenariosService` (ensures idempotency)
- Skips scenarios that already exist (safe to run multiple times)
- Outputs progress and summary statistics

**Scenario Data:**
- Location: `src/seeders/data/scenarios.json`
- Format: JSON array matching `CreateScenarioDto` structure
- Includes: Opening ranges, calling ranges, and 3-betting scenarios
- All scenarios: Tournament, preflop, heads-up, 100bb effective stack

**Manual Scenario Creation:**
You can also create scenarios programmatically via the API:
- `POST /scenarios` - Create a new scenario (requires JWT authentication)
- See API documentation (Swagger UI) for full endpoint details

## 🔐 Authentication System

### JWT-Based Authentication

The Backend uses a **dual-token system**:

- **Access Token**: Short-lived (1 hour) for API requests
- **Refresh Token**: Long-lived (5 hours) for token renewal

### Authentication Flow

1. **Login**: Username/password → JWT tokens in HTTP-only cookies
2. **API Requests**: Access token automatically sent with requests
3. **Token Refresh**: Automatic renewal using refresh token
4. **Logout**: Tokens cleared from cookies

### Guards

- **JwtAuthGuard**: Protects routes requiring authentication
- **LocalAuthGuard**: Handles username/password login
- **JwtRefreshGuard**: Validates refresh tokens

## 👥 User Management

### User Registration

```typescript
POST /users/create
{
  "username": "pokerplayer",
  "email": "player@example.com",
  "password": "securepassword"
}
```

### Email Verification

- **Automatic email** sent on registration
- **JWT token** embedded in verification link
- **Email confirmation** required to activate account

### Password Reset

- **Reset request**: Send email with reset link
- **Token-based**: Secure JWT token for password change
- **Time-limited**: Tokens expire after 30 minutes

## 📁 File Management

### File Upload

```typescript
POST /files/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

file: <file_data>
```

### Features

- **Authenticated uploads**: Only logged-in users
- **AWS S3 storage**: Files stored in cloud
- **User association**: Files linked to user accounts
- **Metadata tracking**: File size, name, upload date

## 🎴 Poker Range Management

### Range Storage

- **MongoDB Integration**: Ranges stored in MongoDB Atlas
- **User-scoped**: Each user has their own private ranges
- **Fast retrieval**: Optimized queries for range analysis
- **Flexible schema**: Supports various range formats

### Range Operations

- **Create**: Define new poker hand ranges
- **Read**: Retrieve ranges by ID or list all user ranges
- **Update**: Modify existing ranges
- **Delete**: Remove ranges from storage
- **Analysis**: Calculate range statistics and equity

## 📧 Email System

### Email Providers

- **AWS SES**: Production email service
- **Ethereal**: Development email testing
- **Configurable**: Environment-based provider selection

### Email Types

- **Account Verification**: Welcome email with confirmation link
- **Password Reset**: Secure reset link with token
- **Template-based**: Consistent email formatting

## 🗄️ Database Schema

The Backend uses a **dual-database architecture**:

- **PostgreSQL (Supabase)**: User accounts, authentication, file metadata
- **MongoDB (Atlas)**: Poker range data and analysis results

### PostgreSQL Entities

#### User Entity

```typescript
{
  uuid: string;           // Unique identifier
  username: string;       // Unique username (6-20 chars)
  email: string;          // Unique email address
  password: string;       // Hashed password
  active: boolean;        // Email verification status
  refreshToken?: string;  // Current refresh token
  files: FileEntity[];    // Associated files
}
```

#### File Entity

```typescript
{
  id: string; // Unique file ID
  filename: string; // Original filename
  size: number; // File size in bytes
  user: UserEntity; // File owner
  createdAt: Date; // Upload timestamp
}
```

### MongoDB Schemas

#### Range Schema

```typescript
{
  userId: string;        // User who created the range
  name: string;          // Range name
  hands: string[];       // Array of poker hands (e.g., ["AA", "KK", "AKs"])
  position?: string;     // Position at table
  action?: string;       // Action type (raise, call, etc.)
  createdAt: Date;       // Creation timestamp
  updatedAt: Date;       // Last modification
}
```

## 🛡️ Security Features

### Authentication Security

- **Password hashing**: bcrypt with salt
- **JWT tokens**: Secure, time-limited tokens
- **HTTP-only cookies**: XSS protection
- **CSRF protection**: SameSite cookie attributes

### Data Validation

- **Class-validator**: Request data validation
- **DTOs**: Type-safe data transfer objects
- **Input sanitization**: Automatic validation

### Security Headers

- **Helmet**: Security headers middleware
- **CORS**: Cross-origin request protection
- **Rate limiting**: Request throttling

## 📊 API Endpoints

### Authentication

```
POST /auth/login          # User login
GET  /auth/refresh        # Refresh access token
POST /auth/logout         # User logout
POST /auth/reset          # Request password reset
```

### Users

```
POST /users/create        # Register new user
POST /users/confirm       # Confirm email address
POST /users/reset-pwd     # Reset password
GET  /users/files         # Get user's files
```

### Files

```
POST /files/upload        # Upload file (authenticated)
GET  /files/:id           # Get file by ID
DELETE /files/:id         # Delete file
```

### Ranges

```
GET    /ranges            # Get all ranges for authenticated user
POST   /ranges            # Create new range
GET    /ranges/:id        # Get specific range
PUT    /ranges/:id        # Update range
DELETE /ranges/:id        # Delete range
```

### Health Check

```
GET /health              # Service health status
GET /                    # API information
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### E2E Tests

E2E tests require running databases:

```bash
# From project root: Start databases
docker-compose up postgres mongodb -d

# From apps/backend: Run E2E tests
npm run test:e2e
```

**Configuration:**
- Uses `.test.env` file (automatically loaded when `NODE_ENV=test`)
- Databases: PostgreSQL `localhost:5432` (`texas_test`), MongoDB `localhost:27017` (`texas_test`)
- Email service mocked (no actual emails sent)

**Troubleshooting:**
- Verify databases running: `docker-compose ps`
- Check logs: `docker-compose logs postgres mongodb`
- Clean restart: `docker-compose down -v && docker-compose up postgres mongodb -d`

**Current Coverage:** `user.e2e-spec.ts` covers authentication flow (user creation, email verification, password reset, JWT validation)

### Test Structure

- **Unit tests**: Individual service/controller testing with mocked dependencies
- **E2E tests**: Full API integration testing with real database connections
- **Mock services**: Isolated testing environment (EmailService mocked in E2E tests)
- **Test coverage**: 73.38% overall coverage - run `npm run test:cov` for detailed report

## 🔄 Development Workflow

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type checking
npm run build
```

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t texas-backend .

# Run container
docker run -p 3000:3000 texas-backend
```

### Environment Setup

1. **Development**: Local PostgreSQL + Local MongoDB + Ethereal email
2. **Production**: Supabase PostgreSQL + MongoDB Atlas + AWS SES
3. **Configuration**: AWS SSM Parameter Store (`/texas/backend/*`)

## 📚 Documentation

### API Documentation (Swagger UI)

Access interactive API documentation at:

```
http://localhost:3000/api
```

### OpenAPI Specification

Automatically generated from:

- **Controller decorators**: Route definitions
- **DTO classes**: Request/response schemas
- **Entity classes**: Database models

## 🔍 Monitoring & Logging

### Health Checks

- **Service health**: `/health` endpoint
- **Database connectivity**: Automatic checks
- **Email service**: Provider status monitoring

### Logging

- **Structured logging**: JSON format
- **Environment-based**: Different log levels
- **Error tracking**: Detailed error information

### Sentry Error Tracking

**Production Only**: All unhandled exceptions are automatically captured via a global exception filter (disabled in development).

**Configuration:**
- DSN stored in AWS SSM: `/texas/backend/SENTRY_DSN`
- Release tracking: `backend@{version}+{git-sha}` (e.g., `backend@2.1.0+a3f5c9d`)
- Trace sampling: 10% default (configurable via `SENTRY_TRACES_SAMPLE_RATE`)

**View Errors:** https://sentry.io/organizations/texas-poker/

## 🤝 Contributing

### Development Guidelines

1. **Follow NestJS patterns**: Use decorators and modules
2. **Write tests**: Unit and E2E tests required
3. **Validate input**: Use DTOs and class-validator
4. **Document APIs**: Add Swagger decorators
5. **Handle errors**: Proper error responses

### Code Style

- **TypeScript**: Strict type checking
- **ESLint**: Code quality rules
- **Prettier**: Code formatting
- **Conventional commits**: Git commit messages

## 📄 License

This project is part of the Texas Poker application and is licensed under the MIT License.
