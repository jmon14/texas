# Contributing to Texas Poker Application

Thank you for your interest in contributing to the Texas Poker application! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- Docker and Docker Compose
- Git
- AWS CLI configured (for production deployment)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd texas
   ```

2. **Start development environment**
   ```bash
   docker-compose up
   ```

3. **Verify setup**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000/api

### Detailed Environment Configuration

#### Development Environment
- **Container Orchestration**: Docker Compose
- **Hot Reload**: All services support live code reloading
- **Database Setup**:
  - PostgreSQL: `postgres:5432`
  - MongoDB: `mongodb:27017`
- **Networking**: Internal Docker network for service communication

#### Service Startup Order
1. PostgreSQL and MongoDB databases start first
2. Backend service starts and waits for database connections
3. Frontend starts and connects to Backend API

#### Environment Variables
Development uses `.env` files in each service directory:
- `apps/frontend/.env` - Frontend configuration
- `apps/backend/.env` - Backend API configuration

#### Database Initialization
- **PostgreSQL**: Automatic migrations via TypeORM on Backend startup
- **MongoDB**: Automatic connection and collection creation via Mongoose in Backend

### Service-Specific Development

Each service has its own development commands and detailed setup instructions:

- **Frontend**: See [apps/frontend/README.md](apps/frontend/README.md) - React app development, Storybook, testing
- **Backend API**: See [apps/backend/README.md](apps/backend/README.md) - NestJS backend, database migrations, email testing, range analysis

### Working with Individual Services

#### Isolated Service Development
You can run services individually for focused development:

```bash
# Run only databases
docker-compose up postgres mongodb

# Then run specific services individually (see service READMEs for commands)
```

#### API Client Generation
The frontend automatically generates TypeScript clients from backend OpenAPI specs:
```bash
cd apps/frontend
npm run openapi:backend
```

Run this command whenever backend API interfaces change.

## 🔧 Development Workflow

### Branch Strategy

- **`main`**: Stable development branch
- **`production`**: Production deployment branch (auto-deploys to AWS)
- **Feature branches**: `feature/description` or `fix/description`

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code patterns and conventions
   - Write tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Frontend tests
   cd apps/frontend && npm test

   # Backend tests
   cd apps/backend && npm test
   ```

4. **Lint and format**
   ```bash
   # Frontend
   cd apps/frontend && npm run lint && npm run format

   # Backend
   cd apps/backend && npm run lint && npm run format
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

## 📝 Code Style Guidelines

### General Principles

- **Consistency**: Follow existing patterns in each service
- **Clarity**: Write self-documenting code with clear variable/function names
- **Security**: Never commit secrets, API keys, or sensitive information
- **Testing**: Write tests for new features and bug fixes

### Frontend

- **Framework**: React with TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI
- **Testing**: Jest + React Testing Library
- **Component Structure**: Follow Atomic Design principles

```typescript
// Example component structure
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  // Component logic here
};
```

### Backend

- **Framework**: NestJS with TypeScript
- **Database**: TypeORM with PostgreSQL
- **Authentication**: JWT with Passport
- **Testing**: Jest for unit tests, supertest for e2e

```typescript
// Example service structure
@Injectable()
export class MyService {
  constructor(
    @InjectRepository(Entity) 
    private repository: Repository<Entity>
  ) {}

  async findAll(): Promise<Entity[]> {
    return this.repository.find();
  }
}
```


## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new functions and methods
- Mock external dependencies
- Test edge cases and error conditions
- Maintain test coverage above 80%

### Integration Tests

- Test API endpoints end-to-end
- Test database interactions
- Test authentication flows

### Manual Testing

- Test in development environment with Docker Compose
- Verify changes work across all services
- Test user workflows end-to-end

## 🔍 Code Review Process

### Before Submitting PR

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console.log or debug statements
- [ ] No secrets or sensitive data

### PR Guidelines

1. **Clear description**: Explain what the PR does and why
2. **Small, focused changes**: Keep PRs manageable in size
3. **Reference issues**: Link to relevant GitHub issues
4. **Screenshots**: Include screenshots for UI changes

### Review Checklist

- [ ] Code quality and consistency
- [ ] Proper error handling
- [ ] Security considerations
- [ ] Performance implications
- [ ] Test coverage

## 🚀 Deployment

### Git Workflow

The project uses a two-branch deployment strategy:

1. **Feature Development**
   ```bash
   git checkout -b feature/your-feature
   # Make changes, commit, push
   git checkout main
   git merge feature/your-feature
   git push origin main
   ```

2. **Release to Production**
   ```bash
   # When ready to release
   git checkout production
   git merge main
   git push origin production
   
   # Then merge back to main to keep branches in sync
   git checkout main
   git merge production
   git push origin main
   ```

### Environment Details

- **`main`**: Development branch with latest features (tested locally)
- **`production`**: Production deployment branch (auto-deploys to AWS)
- **GitHub Actions**: Automatically deploys `production` branch to AWS infrastructure

### Release Checklist

Before merging to production:
- [ ] All tests pass on main branch
- [ ] Features thoroughly tested
- [ ] CHANGELOG.md updated with version and release date
- [ ] Version tag created and pushed
- [ ] Production deployment verified
- [ ] Health checks passing

## 🐛 Bug Reports

When reporting bugs, include:

- **Environment**: Development/Production
- **Steps to reproduce**: Clear step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Browser/System info**: Version details

## 💡 Feature Requests

For new features:

- **Use case**: Describe the problem being solved
- **Proposed solution**: How should it work
- **Alternatives considered**: Other approaches
- **Impact**: Who benefits and how

## 📚 Documentation

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

3. **Create Release**:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

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

## 🔐 Security

- Never commit API keys, passwords, or other secrets
- Use environment variables for configuration
- Follow OWASP security guidelines
- Report security issues privately to maintainers

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

### Database Changes

1. **PostgreSQL (Backend)**
   - Update entities
   - Create migration: `npm run migrate`
   - Test migration in development

2. **MongoDB (Backend)**
   - Update Mongoose schemas
   - Update service logic
   - Test changes with sample data

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.