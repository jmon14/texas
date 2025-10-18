# Claude Multi-Agent System

This directory contains a specialized multi-agent system designed to leverage Claude's capabilities for coordinated development across the Texas poker application ecosystem.

## 🎯 Purpose

The multi-agent approach allows for:

- **Specialized Expertise**: Each agent focuses on their domain of expertise
- **Coordinated Development**: Agents work together on complex features
- **Knowledge Retention**: Documented patterns and best practices per domain
- **Efficient Problem-Solving**: Domain-specific context for faster resolution

## 🤖 Available Agents

### [Backend Architect Agent](./agents/backend.md)

**Role**: Backend system architecture and API development

- NestJS backend architecture and API patterns
- Database design (PostgreSQL + MongoDB)
- Authentication and authorization strategies
- API-first design with OpenAPI/Swagger

### [Frontend Developer Agent](./agents/frontend-developer.md)

**Role**: React/TypeScript development

- Frontend application development
- Component architecture (atomic design)
- State management with Redux Toolkit
- Performance optimization and testing

### [DevOps Engineer Agent](./agents/devops-engineer.md)

**Role**: Infrastructure and deployment

- AWS infrastructure management
- Docker containerization and orchestration
- CI/CD pipeline automation
- Monitoring and security

### [Test Automator Agent](./agents/test-automator.md)

**Role**: Quality assurance and testing

- Comprehensive testing strategies
- Test automation and performance testing
- Quality gates and CI/CD integration
- Cross-service integration testing

### [Documentation Expert Agent](./agents/documentation-expert.md)

**Role**: Technical writing and documentation

- API documentation with OpenAPI/Swagger
- Developer guides and setup instructions
- Architecture and troubleshooting documentation
- Release management and CHANGELOG maintenance

## 🏗️ System Architecture

```
Multi-Agent Coordination
├── Development Agents
│   ├── Backend Architect (NestJS/TypeScript)
│   └── Frontend Developer (React/TypeScript)
│
├── Infrastructure Agent
│   ├── DevOps Engineer (AWS/Docker)
│   └── Deployment Automation
│
├── Quality Agent
│   └── Test Automator (Testing & QA)
│
└── Documentation Agent
    └── Documentation Expert (Technical Writing)
```

## 🚀 How to Use the Multi-Agent System

### 1. Backend Development

```markdown
@backend-architect: Create user profile API endpoints

The Backend Architect will:

- Design appropriate APIs with OpenAPI specs
- Implement business logic
- Add data validation
- Create integration tests
```

### 2. Frontend Development

```markdown
@frontend-developer: Implement user profile components with form validation

The Frontend Developer will:

- Design component architecture
- Implement with TypeScript/React
- Add Redux state management
- Create comprehensive tests
```

### 3. Infrastructure & Deployment

```markdown
@devops-engineer: Deploy user profile feature to production

The DevOps Engineer will:

- Update deployment configurations
- Manage environment variables
- Setup monitoring and logging
- Coordinate production deployment
```

### 4. Quality Assurance

```markdown
@test-automator: Test user profile feature end-to-end

The Test Automator will:

- Create comprehensive test plans
- Execute automated test suites
- Perform integration testing
- Validate cross-service functionality
```

### 5. Documentation

```markdown
@documentation-expert: Document new user profile feature

The Documentation Expert will:

- Update API documentation
- Create developer guides
- Update CHANGELOG
- Document troubleshooting scenarios
```

## 🔄 Agent Collaboration Patterns

### Feature Development Flow

1. **Design Phase**

   - Backend Architect designs API contracts
   - Frontend Developer plans component architecture
   - Technical architecture decisions documented

2. **Implementation Phase**

   - Parallel development across services
   - Continuous integration testing
   - Regular code reviews

3. **Testing Phase**

   - Test Automator creates comprehensive test suites
   - Integration testing across services
   - Performance and security validation

4. **Deployment Phase**
   - DevOps Engineer coordinates deployment
   - Documentation Expert updates all relevant docs
   - Production monitoring and validation

### Communication Protocols

#### Cross-Agent Coordination

```markdown
# Example: API Contract Discussion

@backend-architect @frontend-developer: Need to define user profile API contract

Backend Architect response:

- Proposed endpoints and data structures
- Authentication requirements
- Error handling patterns

Frontend Developer response:

- UI requirements and data needs
- Validation requirements
- State management considerations
```

#### Issue Resolution

```markdown
# Example: Performance Issue

User reports slow profile loading

Coordinated investigation:

- @frontend-developer: Check rendering performance
- @backend-architect: Analyze API response times and database queries
- @devops-engineer: Check infrastructure metrics
- @test-automator: Reproduce and quantify issue
```

## 📊 Project Context & Development Guide

### Current Technology Stack

- **Frontend**: React 18 + TypeScript + Material-UI + Redux Toolkit
- **Backend API**: NestJS + TypeScript + PostgreSQL + MongoDB
- **Infrastructure**: AWS EC2 + ECR + Docker + Terraform
- **Databases**:
  - PostgreSQL (Supabase) - User accounts, authentication, file metadata
  - MongoDB (Atlas) - Poker range data and analysis

### Documentation Structure

The project follows a clear documentation hierarchy:

- **[README.md](../README.md)** - Project overview and quick start
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Complete development setup and workflow (single source of truth)
- **[docs/architecture.md](../docs/architecture.md)** - Technical architecture and system design
- **[docs/troubleshooting.md](../docs/troubleshooting.md)** - Common issues and debugging guide
- **[infrastructure/README.md](../infrastructure/README.md)** - Production deployment on AWS
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and release management
- **Service READMEs** - Service-specific documentation and environment setup

### Service Architecture

```
Production Environment
├── Frontend (Port 8080)
├── Backend API (Port 3000)
└── Nginx Reverse Proxy (Port 80/443)
```

### Development Setup

**For complete development setup, see [CONTRIBUTING.md](../CONTRIBUTING.md)**

#### Quick Start

```bash
# Start all services
docker-compose up

# Access points:
# - Frontend: http://localhost:8080
# - Backend API: http://localhost:3000/api (Swagger docs)
```

#### Service-Specific Setup

Each service requires environment configuration:

- **Frontend**: See [apps/frontend/README.md](../apps/frontend/README.md) - API URLs and development settings
- **Backend API**: See [apps/backend/README.md](../apps/backend/README.md) - Database (PostgreSQL + MongoDB), JWT, and email configuration

#### Production Deployment

```bash
# Deploy to AWS (see infrastructure/README.md for details)
cd infrastructure/
./deploy.sh
```

### Environment Configuration

- **Development**: Local PostgreSQL (postgres:5432) and MongoDB (mongodb:27017) via Docker
- **Production**: Supabase (PostgreSQL) and MongoDB Atlas (free tier)
- **Local**: Uses docker-compose.yml
- **Production**: Uses docker-compose.prod.yml with ECR images
- **Secrets**: Environment variables managed via AWS SSM Parameter Store in production
- **SSL**: Let's Encrypt certificates with automatic renewal

### Development Workflow

**Complete workflow details in [CONTRIBUTING.md](../CONTRIBUTING.md)**

- **Git Workflow**: Feature branches → main → production (with release management)
- **Local Development**: Docker Compose with hot reload for all services
- **Testing**: Jest + React Testing Library with comprehensive coverage
- **Code Quality**: ESLint + Prettier with TypeScript strict mode
- **Release Management**: Semantic versioning with [CHANGELOG.md](../CHANGELOG.md)
- **Deployment**: Automated AWS deployment via [infrastructure/README.md](../infrastructure/README.md)
- **Documentation**: Agent-agnostic workflows with service-specific details in READMEs

## 🎯 Best Practices

### When to Use Which Agent

#### Single-Domain Tasks

```markdown
# Use specific agent for domain-focused work

@frontend-developer: Update user interface styling
@backend-architect: Add new API validation
@devops-engineer: Update SSL certificate
@test-automator: Add unit tests for new feature
@documentation-expert: Update API documentation
```

#### Cross-Domain Features

```markdown
# Coordinate multiple agents for complex features

@backend-architect @frontend-developer: Implement real-time notifications

Coordinated approach using established workflows:

- Reference CONTRIBUTING.md for development setup and git workflow
- Backend: WebSocket implementation per apps/backend/README.md patterns
- Frontend: UI components following apps/frontend/README.md guidelines
- Test Automator: Integration testing for WebSocket communication
- DevOps: Infrastructure updates per infrastructure/README.md
- Documentation: Update architecture and API docs
```

#### Complex Problem Solving

```markdown
# Use multiple agents for comprehensive analysis

Investigate production performance issues

Coordinated response using documentation resources:

- @devops-engineer: Infrastructure metrics (reference infrastructure/README.md)
- @backend-architect: Database and API performance (check apps/backend/README.md)
- @frontend-developer: Client-side performance (reference apps/frontend/README.md)
- @test-automator: Performance testing and benchmarks
- @documentation-expert: Update troubleshooting.md with findings
```

### Agent Interaction Guidelines

1. **Documentation-First Approach**: All agents reference [CONTRIBUTING.md](../CONTRIBUTING.md) for workflows
2. **Clear Scope Definition**: Each agent focuses on their expertise area
3. **Service-Specific References**: Use service READMEs for detailed implementation guidance
4. **Architecture Awareness**: Reference [docs/architecture.md](../docs/architecture.md) for system design decisions
5. **Problem Resolution**: Use [docs/troubleshooting.md](../docs/troubleshooting.md) for debugging guidance
6. **Version Management**: Follow [CHANGELOG.md](../CHANGELOG.md) patterns for releases
7. **Coordination**: Coordinate directly between agents for multi-domain tasks

## 📁 File Organization

```
.claude/
├── CLAUDE.md                   # Multi-agent system overview and project documentation
└── agents/
    ├── backend.md              # Backend architecture and NestJS development
    ├── frontend-developer.md   # React/TypeScript development
    ├── devops-engineer.md      # Infrastructure and deployment
    ├── test-automator.md       # Testing and quality assurance
    └── documentation-expert.md # Documentation maintenance
```

## 🔧 System Evolution

This multi-agent system is built on a solid documentation foundation and designed to evolve:

### Documentation-Driven Development
- **Single Source of Truth**: [CONTRIBUTING.md](../CONTRIBUTING.md) contains all development workflows
- **Service-Specific Guidance**: Each service README provides detailed implementation details
- **Architecture Documentation**: [docs/architecture.md](../docs/architecture.md) captures design decisions
- **Troubleshooting Knowledge**: [docs/troubleshooting.md](../docs/troubleshooting.md) grows with discovered solutions

### Agent System Evolution
- **Agent Specialization**: Agents reference established documentation patterns
- **New Domains**: Additional agents can be added following the same documentation structure
- **Workflow Consistency**: All agents follow the same development and release processes
- **Knowledge Maintenance**: Agent knowledge stays current through documentation references

### Scalability Benefits
- **Human-AI Collaboration**: Documentation works for both human developers and AI agents
- **Onboarding Efficiency**: New team members (human or AI) follow the same clear processes
- **Maintenance Reduction**: Updates to workflows happen in one place (CONTRIBUTING.md)
- **Quality Consistency**: Standardized processes ensure consistent output quality

The goal is to create a powerful, coordinated development environment that leverages Claude's capabilities while maintaining clear separation of concerns, efficient collaboration patterns, and sustainable documentation practices.
