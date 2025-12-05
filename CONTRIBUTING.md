# Contributing to Texas Poker Application

Thank you for your interest in contributing to the Texas Poker application! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Quick Start

For a quick start guide and prerequisites, see [README.md](README.md#prerequisites). The following sections provide detailed information for developers contributing to the project.

### Development Environment Details

#### Container Orchestration
- **Docker Compose**: All services run in containers
- **Hot Reload**: All services support live code reloading
- **Networking**: Internal Docker network for service communication

#### Service Startup Order
1. PostgreSQL and MongoDB databases start first
2. Backend service starts and waits for database connections
3. Frontend starts and connects to Backend API

#### Database Configuration
- **PostgreSQL**: `postgres:5432` - User accounts, authentication, file metadata
- **MongoDB**: `mongodb:27017` - Poker ranges and scenarios
- **Database Initialization**:
  - **PostgreSQL**: Automatic migrations via TypeORM on Backend startup
  - **MongoDB**: Automatic connection and collection creation via Mongoose in Backend

### Service-Specific Development

Each service has its own development commands and detailed setup instructions:

- **Frontend**: See [apps/frontend/README.md](apps/frontend/README.md) - React app development, Storybook, testing, API client generation
- **Backend API**: See [apps/backend/README.md](apps/backend/README.md) - NestJS backend, database migrations, email testing, range analysis

## 🔧 Development Workflow

### Branch Strategy

- **`main`**: Development branch - all changes are committed directly here
- **`production`**: Production deployment branch (auto-deploys to AWS)

### Making Changes

1. **Make your changes**
   - Follow existing code patterns and conventions
   - Write tests for new functionality
   - Update documentation as needed (see [Documentation Update Triggers](#documentation-update-triggers))

2. **Test your changes**
   ```bash
   # Frontend tests
   cd apps/frontend && npm test

   # Backend tests
   cd apps/backend && npm test
   ```
   
   **If tests fail**: Fix the issues and re-run tests until all pass before proceeding.

3. **Lint and format**
   ```bash
   # Frontend
   cd apps/frontend && npm run lint && npm run format

   # Backend
   cd apps/backend && npm run lint && npm run format
   ```
   
   **If linting fails**: Fix the issues and re-run linting until all pass before proceeding.

4. **Update CHANGELOG.md**
   - Add changes to `CHANGELOG.md` under `## [Unreleased]` section
   - Only proceed to this step after all tests and linting pass

5. **Commit changes directly to main**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   git push origin main
   ```

## 📝 Code Style Guidelines

### General Principles

- **Security**: Never commit secrets, API keys, or sensitive information
- **Error Handling**: Handle errors explicitly and gracefully; avoid silent failures
- **Type Safety**: Use TypeScript strictly, avoid `any`, prefer explicit types, and avoid type casting when possible
- **Commit Messages**: Use conventional commits format (feat:, fix:, docs:, etc.)
- **Async/Await**: Prefer async/await over promise chains
- **Dead Code**: Remove unused code, imports, and functions
- **Constants**: Extract magic numbers and hardcoded values to named constants files

### Frontend

- **Component Structure**: Follow Atomic Design principles (atoms → molecules → organisms → pages)
- **State Management**: Use Redux Toolkit for global state; prefer local state for component-specific data
- **Component Patterns**: Use functional components with hooks; define props interfaces explicitly
- **Storybook**: Add Storybook stories for reusable components

### Backend

- **Service Structure**: Use NestJS decorators and dependency injection; keep services focused and single-responsibility
- **Database**: Use TypeORM repositories for PostgreSQL; Mongoose schemas for MongoDB; handle transactions explicitly
- **API Design**: Use DTOs for request/response validation; add Swagger decorators for documentation
- **Error Handling**: Use NestJS exception filters; return consistent error response formats


## 🧪 Testing Guidelines

### Test Organization

- **Structure**: Use `describe()` blocks to group related tests; use `it()` for individual test cases
- **Pattern**: Follow AAA pattern (Arrange, Act, Assert) for readable tests
- **File Organization**: Co-locate tests in `__tests__/` folders alongside source files
- **Naming**: Use descriptive test names that explain what is being tested

### Unit Tests

- Write tests for all new functions and methods
- Mock external dependencies
- Test edge cases and error conditions
- Focus on meaningful coverage of critical paths rather than achieving 100%

### Integration Tests

- **Frontend**: Test component interactions, Redux store integration, and API integration (with MSW)
- **Backend**: Test API endpoints end-to-end, database interactions, and authentication flows

### E2E Testing

- Use E2E tests for critical user workflows and cross-service integration
- Prefer unit and integration tests for isolated functionality

## 🚀 Deployment

### Release to Production

When ready to deploy:

1. **Update CHANGELOG.md**
   - Move items from `## [Unreleased]` to a new version section
   - Add release date in format `## [X.Y.Z] - YYYY-MM-DD`
   - Keep `[Unreleased]` section empty for future changes

2. **Update package versions**
   - Update version in `apps/frontend/package.json`
   - Update version in `apps/backend/package.json`

3. **Merge main to production**
   ```bash
   git checkout production
   git merge main
   git push origin production
   ```

4. **Deploy**
   - GitHub Actions automatically deploys `production` branch to AWS infrastructure

### Release Checklist

Before deploying to production:
- [ ] All tests pass on main branch
- [ ] Features thoroughly tested
- [ ] CHANGELOG.md updated with version and release date
- [ ] Package versions updated in both frontend and backend
- [ ] Production deployment verified
- [ ] Health checks passing

## 📚 Documentation

### Documentation Update Triggers

Update documentation in the following scenarios:

**Required Updates:**
- **New features**: Update relevant README files, add API documentation if applicable
- **API changes**: Update API documentation (Swagger/OpenAPI), update service READMEs
- **Breaking changes**: Update all affected documentation, add migration guides if needed

**Optional but Recommended:**
- **Bug fixes**: Update troubleshooting docs if the fix addresses a documented issue
- **Performance improvements**: Document significant optimizations
- **Refactoring**: Update docs if architecture or patterns change significantly
- **Complex logic**: Add inline code documentation for non-obvious implementations

### Documentation Guidelines

- Update relevant README files for your changes
- Add inline code documentation for complex logic
- Update API documentation for endpoint changes
- Include examples in documentation when helpful

### Changelog Maintenance

The project follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format with [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

#### During Development
- Add changes to the `## [Unreleased]` section in CHANGELOG.md as you implement them
- Group changes by category:
  - **Added**: New features and functionality
  - **Changed**: Changes to existing functionality
  - **Deprecated**: Features that will be removed in future versions
  - **Removed**: Features removed in this version
  - **Fixed**: Bug fixes
  - **Security**: Security-related changes and improvements

#### Release Process
1. **Determine Version Number** (Semantic Versioning):
   - **MAJOR** (X.0.0): Breaking changes
   - **MINOR** (1.X.0): New features (backward compatible)
   - **PATCH** (1.0.X): Bug fixes (backward compatible)

2. **Update Changelog**:
   - Move all items from `[Unreleased]` to new version section
   - Add release date in format `## [X.Y.Z] - YYYY-MM-DD`
   - Keep `[Unreleased]` section empty for future changes

3. **Update Package Versions**:
   - Update version in `apps/frontend/package.json`
   - Update version in `apps/backend/package.json`

4. **Merge to Production**:
   - Follow the [Release to Production](#release-to-production) workflow above

#### Example Changelog Entry Format
```markdown
## [Unreleased]

## [1.1.0] - 2024-01-15

### Added
- New user dashboard with analytics
- Email notification system

### Fixed
- Login redirect issue after password reset
- File upload progress indicator

## [1.0.0] - 2023-12-01
```

## ⚡ Common Development Tasks

### Adding a new API endpoint

1. **Backend**
   - Create/update controller
   - Add service logic
   - Create/update DTOs
   - Write tests
   - Update OpenAPI documentation

2. **Frontend**
   - Generate API client: `npm run openapi:backend`
   - Create/update components
   - Add state management if needed
   - Write tests
   - Update Storybook stories