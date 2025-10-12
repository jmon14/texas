# Claude Multi-Agent System

This directory contains a specialized multi-agent system designed to leverage Claude's capabilities for coordinated development across the Texas poker application ecosystem.

## 🎯 Purpose

The multi-agent approach allows for:

- **Specialized Expertise**: Each agent focuses on their domain of expertise
- **Coordinated Development**: Agents work together on complex features
- **Knowledge Retention**: Documented patterns and best practices per domain
- **Efficient Problem-Solving**: Domain-specific context for faster resolution

## 🤖 Available Agents

### [Project Manager Agent](./agents/project-manager.md)

**Role**: Project coordination and documentation

- ClickUp kanban workflow management
- Feature breakdown into tickets
- Documentation maintenance
- Cross-service coordination

### [Architect Agent](./agents/architect.md)

**Role**: Technical design and system architecture

- System architecture and integration patterns
- API contract design and specifications
- Database schema planning and optimization
- Technical decision records and documentation

### [Frontend Agent](./agents/frontend.md)

**Role**: React/TypeScript development

- Frontend application development
- Component architecture (atomic design)
- State management with Redux Toolkit
- Performance optimization and testing

### [Backend Node.js Agent](./agents/backend-node.md)

**Role**: NestJS/TypeScript API development

- Backend service development (unified API)
- JWT authentication and authorization
- PostgreSQL/TypeORM data modeling (users, files)
- MongoDB/Mongoose integration (poker ranges)
- API design and testing strategies

### [DevOps Agent](./agents/devops.md)

**Role**: Infrastructure and deployment

- AWS infrastructure management
- Docker containerization and orchestration
- CI/CD pipeline automation
- Monitoring and security

### [QA Agent](./agents/qa.md)

**Role**: Quality assurance and testing

- Comprehensive testing strategies
- Test automation and performance testing
- Quality gates and CI/CD integration
- Security and accessibility testing

## 🏗️ System Architecture

```
Multi-Agent Coordination
├── Project Manager (Orchestrator)
│   ├── Task Planning & Coordination
│   ├── Architecture Decisions
│   └── Progress Monitoring
│
├── Development Agents
│   ├── Frontend (React/TypeScript)
│   └── Backend (NestJS/TypeScript)
│
├── Infrastructure Agent
│   ├── DevOps (AWS/Docker)
│   └── Deployment Automation
│
└── Quality Agent
    ├── Testing Strategies
    └── Quality Assurance
```

## 🚀 How to Use the Multi-Agent System

### 1. Starting a New Feature

```markdown
@project-manager: Plan implementation of user profile management feature

The Project Manager will:

- Break down the feature into tasks
- Identify cross-service dependencies
- Coordinate with relevant agents
- Create implementation timeline
```

### 2. Frontend Development

```markdown
@frontend: Implement user profile components with form validation

The Frontend Agent will:

- Design component architecture
- Implement with TypeScript/React
- Add Redux state management
- Create comprehensive tests
```

### 3. Backend Development

```markdown
@backend: Create user profile API endpoints

The Backend Agent will:

- Design appropriate APIs
- Implement business logic
- Add data validation
- Create integration tests
```

### 4. Infrastructure & Deployment

```markdown
@devops: Deploy user profile feature to staging

The DevOps Agent will:

- Update deployment configurations
- Manage environment variables
- Setup monitoring and logging
- Coordinate production deployment
```

### 5. Quality Assurance

```markdown
@qa: Test user profile feature end-to-end

The QA Agent will:

- Create comprehensive test plans
- Execute automated test suites
- Perform security and performance testing
- Validate cross-browser compatibility
```

## 🔄 Agent Collaboration Patterns

### Feature Development Flow

1. **Planning Phase**

   - Project Manager coordinates requirements
   - Agents provide domain-specific estimates
   - Technical architecture decisions made

2. **Implementation Phase**

   - Parallel development across domains
   - Regular check-ins via Project Manager
   - Continuous integration testing

3. **Integration Phase**

   - Cross-service integration testing
   - Performance and security validation
   - DevOps coordinates deployment

4. **Quality Assurance Phase**
   - Comprehensive testing across all layers
   - User acceptance testing
   - Production readiness validation

### Communication Protocols

#### Cross-Agent Coordination

```markdown
# Example: API Contract Discussion

@backend @frontend: Need to define user profile API contract

Backend Node.js Agent response:

- Proposed endpoints and data structures
- Authentication requirements
- Error handling patterns

Frontend Agent response:

- UI requirements and data needs
- Validation requirements
- State management considerations
```

#### Issue Resolution

```markdown
# Example: Performance Issue

@project-manager: User reports slow profile loading

Project Manager coordinates investigation:

- @frontend: Check rendering performance
- @backend: Analyze API response times and database queries
- @devops: Check infrastructure metrics
- @qa: Reproduce and quantify issue
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

@frontend: Update user interface styling
@backend: Add new API validation
@devops: Update SSL certificate
```

#### Cross-Domain Features

```markdown
# Start with Project Manager for coordination

@project-manager: Implement real-time notifications

Project Manager will coordinate using established workflows:

- Reference CONTRIBUTING.md for development setup and git workflow
- Frontend: UI components following apps/frontend/README.md guidelines
- Backend: WebSocket implementation per apps/backend/README.md patterns
- DevOps: Infrastructure updates per infrastructure/README.md
- QA: Testing strategies following project testing standards
```

#### Complex Problem Solving

```markdown
# Use multiple agents for comprehensive analysis

@project-manager: Investigate production performance issues

Coordinated response using documentation resources:

- DevOps: Infrastructure metrics (reference infrastructure/README.md)
- Backend: Database and API performance (check apps/backend/README.md)
- Frontend: Client-side performance (reference apps/frontend/README.md)
- QA: Performance testing and benchmarks
- Reference docs/troubleshooting.md for common issues and solutions
```

### Agent Interaction Guidelines

1. **Documentation-First Approach**: All agents reference [CONTRIBUTING.md](../CONTRIBUTING.md) for workflows
2. **Clear Scope Definition**: Each agent focuses on their expertise area
3. **Service-Specific References**: Use service READMEs for detailed implementation guidance
4. **Architecture Awareness**: Reference [docs/architecture.md](../docs/architecture.md) for system design decisions
5. **Problem Resolution**: Use [docs/troubleshooting.md](../docs/troubleshooting.md) for debugging guidance
6. **Version Management**: Follow [CHANGELOG.md](../CHANGELOG.md) patterns for releases
7. **Coordination**: Use Project Manager for complex multi-agent tasks

## 📁 File Organization

```
.claude/
├── claude.md                   # Multi-agent system overview and project documentation
└── agents/
    ├── project-manager.md      # Project coordination and documentation
    ├── architect.md            # Technical design and system architecture
    ├── frontend.md   # React/TypeScript specialist
    ├── backend.md    # NestJS/TypeScript specialist
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
