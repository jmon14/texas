# Changelog

All notable changes to the Texas Poker application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.4] - 2025-01-XX

### Added

#### Phase 2: TexasSolver Post-Flop Support (Task 2)
- **Post-Flop TexasSolver Integration**: Extended TexasSolver service to support post-flop scenario solving
  - Added optional `boardCards` field to `SolveScenarioDto` with format validation
  - Updated `solveScenario()` method to accept and process board cards
  - Implemented automatic format conversion from space-separated ("As Kh 7d") to comma-separated ("As,Kh,7d") for TexasSolver
- **Street-Specific Configuration**: Added post-flop street handling in config generation
  - Automatic dump rounds configuration based on street (flop=2, turn=3, river=4)
  - Street-specific bet sizes configuration (50% bet, 60% raise) for all future streets
  - When on flop: sets bet sizes for flop, turn, and river
  - When on turn: sets bet sizes for turn and river
  - When on river: sets bet sizes for river only
- **Testing**: Comprehensive test coverage for post-flop TexasSolver functionality
  - Added 9 new tests covering dump rounds, bet sizes, and board card format conversion
  - Tests verify correct configuration for flop, turn, and river scenarios
  - Tests verify preflop scenarios don't include post-flop configurations
  - All 48 tests passing

### Changed
- Updated `package.json` version: `2.2.3` → `2.2.4`
- Updated `generateConfigFile()` to handle post-flop streets with proper bet size and dump rounds configuration
- Improved config generation logic to match TexasSolver sample config files exactly

## [2.2.3] - 2025-01-XX

### Added

#### Phase 2: Post-Flop Scenario Schema Support (Task 1)
- **Post-Flop Scenario Schema**: Extended scenario schema to support post-flop scenarios
  - Added `boardCards` field to `Scenario` schema (format: "As Kh 7d" for flop, turn, river)
  - Made `boardTexture` conditionally required for post-flop scenarios
  - Created `IsRequiredIfPostFlop` custom validator for conditional field requirements
  - Created `scenario-validation.utils.ts` with arrow-function-based validation helpers
- **DTO Updates**: Enhanced DTOs for post-flop scenario support
  - Added `boardCards` field to `CreateScenarioDto` with format validation
  - Added `boardCards` field to `ScenarioResponseDto`
  - Implemented conditional validation using custom decorators
- **Service Layer Validation**: Added comprehensive post-flop validation in `ScenariosService`
  - Validates `boardCards` format (3-5 cards matching poker notation)
  - Ensures `boardTexture` is provided for post-flop scenarios
  - Throws `BadRequestException` with clear error messages for invalid scenarios
- **Testing**: Comprehensive test coverage for post-flop scenario validation
  - Unit tests for DTO validation (6 tests covering format validation)
  - Service layer tests for post-flop validation (5 tests covering error cases)
  - Tests verify preflop scenarios can omit board fields
  - Tests verify post-flop scenarios require board fields with proper format

### Changed
- Updated `package.json` version: `2.2.2` → `2.2.3`
- Moved conditional validation logic from Mongoose schema to service layer for better TypeScript compatibility
- Simplified DTO validation by removing redundant `@ValidateIf` decorators (handled by `@IsOptional()`)

### Added

#### Phase 1: Scenario Browser UI
- **Scenario Browser Frontend**: Complete UI for browsing and viewing poker scenarios
  - Created `ScenarioList` component with card-based list view
  - Implemented client-side filtering by Game Type, Difficulty, and Category
  - Added `ScenarioDetail` component for full scenario information display
  - Created reusable `ScenarioCard` molecule component
  - Created `DifficultyBadge` atom component with color-coded difficulty levels
- **Redux State Management**: Complete state management for scenarios
  - Created `scenario-slice.ts` with async thunks for fetching scenarios
  - Integrated scenario state into Redux store
  - Implemented loading and error state handling
- **API Integration**: Full integration with backend scenarios API
  - Regenerated OpenAPI client to include `ScenariosApi` and `ScenarioResponseDto`
  - Added `scenariosApi` to frontend API layer
  - Created MSW handlers for development and testing
- **Routing**: Added scenario routes and navigation
  - Added `/scenarios` route for list view
  - Added `/scenarios/:id` route for detail view
  - Added "Scenarios" link to sidebar navigation
- **Testing**: Comprehensive test coverage
  - Unit tests for `scenario-slice.ts` (all async thunks and reducers)
  - Component tests for `DifficultyBadge`, `ScenarioCard`, `ScenarioList`, and `ScenarioDetail`
  - Tests cover loading states, error handling, filtering, and navigation

### Changed
- Updated frontend API client to include scenarios endpoints
- Enhanced sidebar navigation with scenarios link

## [2.2.2] - 2025-11-05

### Added

#### Phase 1: Scenario Seeding System
- **Scenario Seeding**: Complete seeding infrastructure for initial scenario data
  - Created `src/seeders/` folder with seed script infrastructure
  - Added `scenarios.json` data file with 15 tournament preflop scenarios
  - Implemented `scenarios.seeder.ts` script following existing migration pattern
  - Idempotent seeding (safe to run multiple times, skips existing scenarios)
- **Scenario Creation API**: POST endpoint for programmatic scenario creation
  - Added `POST /scenarios` endpoint with JWT authentication
  - Created `CreateScenarioDto` with comprehensive validation
  - Added `create()` method to `ScenariosService` (reusable for script + endpoint)
  - Conflict detection for duplicate scenario names
- **Testing**: Comprehensive test coverage for new functionality
  - Unit tests for `ScenariosService.create()` method (3 test cases)
  - Controller tests for `POST /scenarios` endpoint
  - Tests cover idempotency, conflict handling, and optional fields
- **Documentation**: Updated documentation with seeding instructions
  - Added seeding commands to `apps/backend/README.md`
  - Documented seed script usage and scenario data format
  - Updated API documentation (OpenAPI/Swagger) for new endpoint

### Changed
- Updated `package.json` version: `2.2.1` → `2.2.2`
- Added npm script: `seed:scenarios` for easy scenario seeding

## [2.2.0] - 2025-11-03

### Added

#### Phase 1: Scenario System Foundation
- **Scenario Data Models**: Complete MongoDB schema implementation for scenario-based poker learning
  - Created `Scenario` schema with position, action type, stack depth, and context fields
  - Created `ReferenceRange` schema for storing GTO-solved ranges linked to scenarios
  - Created `UserRangeAttempt` schema for tracking user practice attempts and comparison results
  - Created `Position` enum for type-safe 6-max poker positions (UTG, MP, CO, BTN, SB, BB)
  - Created `PreviousAction` schema for structured action history representation
- **Schema Enhancements**: Updated existing range schemas for scenario system compatibility
  - Renamed `rangeFraction` → `carryoverFrequency` in `HandRange` schema for clarity
  - Renamed `percentage` → `frequency` in `Action` schema for consistency
  - Added optional `ev` and `equity` fields to `Action` schema for future GTO data integration
- **Data Model Foundation**: Established complete data structure for MVP poker calculator
  - All schemas properly typed with TypeScript interfaces
  - MongoDB collections configured with proper indexing and transforms
  - Comprehensive unit tests for all new schemas (9 new test suites)
  - Ready for Phase 2 GTO import and Phase 3 comparison engine

#### Phase 0: TexasSolver Integration
- **TexasSolver Service**: Complete integration with TexasSolver C++ GTO poker solver
  - Created `TexasSolverService` for programmatic scenario solving
  - Config file generation from scenario parameters (stack depth, pot size, ranges)
  - Solver binary execution with proper resource path management
  - JSON output parsing and transformation to `Range` schema format
  - Support for preflop tournament scenarios (Phase 0 scope)
- **Solver Workflow**: End-to-end integration workflow established
  - Automatic config file generation in `tmp/texas-solver/` directory
  - Solver execution with configurable timeout and error handling
  - JSON parsing with recursive tree traversal to find root strategy nodes
  - Action type mapping (FOLD, CALL, RAISE, CHECK) to internal `ActionType` enum
  - Frequency conversion from 0-1 floats to 0-100 percentages
- **Comprehensive Testing**: Full test suite for TexasSolver integration
  - 39 passing unit tests covering all service methods
  - Pure logic function tests (combo conversion, frequency averaging, action mapping)
  - Strategy extraction tests (root node finding, nested structure handling)
  - Config generation tests with various scenario parameters
  - Full workflow integration tests with mock solver outputs
  - Test fixtures for different solver output structures
- **Documentation**: Complete integration guide created
  - Comprehensive guide at `docs/texas-solver-integration.md`
  - Architecture diagrams and workflow explanations
  - Config file format documentation
  - JSON output structure reference
  - Troubleshooting guide for common issues
  - Performance considerations and optimization tips
- **TexasSolver Binary**: Added solver executable and resources
  - macOS binary at `apps/backend/tools/TexasSolver/console_solver`
  - Resource directory with dictionaries, game trees, and config templates
  - Proper path resolution for development and production environments
  - Ready for Docker containerization (included in backend build context)

### Changed

#### Phase 1: Module Architecture Refactoring
- **Scenarios Module Separation**: Created dedicated `ScenariosModule` for better separation of concerns
  - Extracted scenario-related functionality from `RangesModule` into standalone `ScenariosModule`
  - Moved scenario schemas (`Scenario`, `ReferenceRange`, `UserRangeAttempt`, `PreviousAction`) to `scenarios/schemas/`
  - Moved scenario DTOs (`ScenarioResponseDto`, `PreviousActionDto`) to `scenarios/dtos/`
  - Moved scenario enums (`Position`, `GameType`, `Difficulty`, `Street`, `ScenarioActionType`, `BoardTexture`, `Category`) to `scenarios/enums/`
  - Moved `ScenariosService` and `ScenariosController` to `scenarios/` module
  - Improved module organization following NestJS feature-based architecture patterns
  - Maintained cross-module dependencies properly (`PreviousAction` imports `ActionType` from ranges, `ReferenceRange` imports `Range` from ranges)
  - All 131 tests passing after refactoring
- **Ranges Module Cleanup**: Streamlined `RangesModule` to focus on range management
  - Removed scenario-related schemas, DTOs, enums, and controllers
  - Module now focuses exclusively on user range management and TexasSolver integration
  - `TexasSolverService` remains in ranges module (produces `Range` objects, all dependencies are ranges-related)
  - Maintained backward compatibility with exported services

#### Phase 1: Schema Field Renames
- **HandRange Schema**: `rangeFraction` field renamed to `carryoverFrequency`
  - Better reflects purpose: combo frequency from previous street based on mixed strategies
  - Updated all DTOs, services, and tests
  - Breaking change handled with comprehensive migration
- **Action Schema**: `percentage` field renamed to `frequency`
  - More accurate terminology (frequency vs percentage)
  - Updated all references throughout codebase
  - Consistent naming across all action-related code

## [2.1.0] - 2025-10-25

### Added

#### Sentry Error Tracking Integration
- **Automatic Error Tracking**: Integrated Sentry for production error monitoring and tracking
  - Captures unhandled exceptions with full stack traces and context
  - Tracks release versions with git SHA for precise error correlation
  - Performance monitoring with configurable trace sampling (10% default)
- **Environment-Based Initialization**: Sentry only runs in production
  - Completely disabled in development to avoid polluting error tracking
  - No setup required for local development
  - Console logs clearly indicate Sentry status
- **Release Tracking**: Hybrid versioning system combining semantic version with git SHA
  - Format: `backend@{version}+{git-sha}` (e.g., `backend@2.1.0+a3f5c9d`)
  - Automatic version reading from `package.json`
  - Links Sentry errors directly to GitHub commits
- **Global Exception Filter**: Automatic error capture via NestJS global filter
  - Applied only in production environment
  - Safe fallback checks prevent crashes if Sentry not initialized
  - Continues with default exception handling after capture
- **Infrastructure Configuration**: Secure DSN management via AWS SSM Parameter Store
  - SSM parameter: `/texas/backend/SENTRY_DSN` (SecureString)
  - Managed by Terraform in `infrastructure/aws/ssm.tf`
  - Automatically fetched during deployment
- **Deployment Integration**: Seamless integration with existing CI/CD pipeline
  - GitHub Actions passes git SHA for release tracking
  - Deploy script fetches DSN from SSM
  - Docker Compose injects environment variables
- **Documentation**: Comprehensive Sentry integration guide (`apps/backend/SENTRY.md`)
  - Architecture overview and component descriptions
  - Configuration and deployment instructions
  - Best practices and troubleshooting
  - Future improvements roadmap

### Fixed

#### Backend Build Configuration
- **TypeScript Output Structure**: Fixed production build output location
  - Issue: Changing `rootDir` to `"./"` caused compiled files to output to `dist/src/` instead of `dist/`
  - Docker container expected `dist/main.js` but found `dist/src/main.js`
  - Fix: Override `rootDir` to `"./src"` in `tsconfig.build.json`
  - Result: Production builds output to correct location while development linting works for test files

#### Backend E2E Test Linting
- **TypeScript Configuration**: Fixed linter errors in test files
  - Added `test/**/*` to `include` array in `tsconfig.json`
  - Changed `rootDir` from `"./src"` to `"./"` to encompass both src and test directories
  - Added explicit `"types": ["jest", "node"]` for Jest globals recognition
  - Resolved 26 linter errors (describe, it, expect, beforeAll, afterAll, beforeEach not found)
  - Fixed `ResetPwdDto` type errors with proper token field recognition

### Changed

#### Sentry Configuration
- **Trace Sample Rate**: Production default set to 10% (0.1)
  - Balances error visibility with cost efficiency
  - Configurable via `SENTRY_TRACES_SAMPLE_RATE` environment variable
  - Can be adjusted based on traffic and monitoring needs

### Fixed

#### Backend Docker Build - Module Not Found Error
- **Root Cause**: `jest.setup.ts` file at project root caused TypeScript to change output structure
  - Without `rootDir` set, TypeScript preserved directory structure creating `dist/src/main.js`
  - Docker container start command expected `dist/main.js` causing "Cannot find module" error
  - Issue introduced when jest.setup.ts was added for test improvements after commit `3b0b296`
- **Fix Applied**:
  - Added `rootDir: "./src"` to `tsconfig.json` to ensure proper output structure
  - Added `jest.setup.ts` to `.dockerignore` to exclude it from Docker builds
  - Added exclude list to `tsconfig.json` to prevent compilation of test files
- **Result**: Backend builds correctly with `dist/main.js` in proper location
  - Container starts successfully
  - Health endpoint accessible at `/api/health`
  - Production deployments now functional

#### Frontend E2E Tests - MSW Browser Worker Integration
- **MSW Browser Worker**: Added Mock Service Worker for browser-based E2E tests
  - Created `src/msw/browser.ts` with browser worker setup using `msw/browser`
  - Created `src/msw/init.ts` for isolated MSW initialization logic (separation of concerns)
  - Updated `src/index.tsx` to conditionally initialize MSW before app render
  - MSW only activates when `REACT_APP_ENABLE_MSW=true` environment variable is set
- **Webpack Environment Variables**: Fixed webpack not passing environment variables from Playwright to React app
  - Updated `webpack.config.ts` to merge `process.env` with `.env` file variables in development mode
  - Allows Playwright's `webServer.env` variables to override file-based env vars
  - Fixed root cause: webpack was only loading `.env` files, ignoring `process.env` in development
- **Playwright Configuration**: Added `REACT_APP_ENABLE_MSW=true` to `webServer.env` in `playwright.config.ts`
- **Documentation**: Updated `e2e/README.md` with MSW integration architecture and workflow
- **Result**: All 6 E2E tests passing locally and ready for CI/CD
  - No backend infrastructure required for E2E tests
  - Same MSW handlers as unit tests ensure consistency
  - Fast, reliable tests with predictable mock data

#### CI/CD Quality Gate Enforcement (Critical Security Fix)
- **Deploy Job Dependencies**: Fixed critical flaw where deployment proceeded despite linting failures
  - Added `backend-quality` and `frontend-quality` jobs to deploy job dependencies
  - Updated deploy conditional to check quality gate results
  - Linting failures now properly block deployment as intended
  - Prevents deployment of code that fails quality checks

#### Frontend E2E Test Environment
- **Playwright Configuration**: Added missing `REACT_APP_BACKEND_API_URL` environment variable
  - Added to `webServer.env` in `playwright.config.ts`
  - Fixes issue where React app loaded but didn't render properly in CI
  - All 6 E2E tests now pass in CI
- **TypeScript Configuration**: Fixed linter errors in test files
  - Added `node` and `jest` types to `tsconfig.json` compiler options
  - Included `playwright.config.ts` and `jest.setup.ts` in compilation
  - Resolved `process.env` errors and Jest global type issues
  - Fixed `@testing-library/jest-dom` type errors (toBeInTheDocument)

#### Backend E2E Test Environment  
- **Test Database Setup**: Created missing test environment configuration
  - Created `.test.env` from `.test.env.example` template
  - Created `texas_test` PostgreSQL database
  - Ran database migrations for test schema
  - Backend E2E tests now pass locally
- **Mock Data Fixes**: Corrected test data for user creation endpoint
  - Added `mockRegisterDto` (RegisterDto without uuid) for `/users/create` endpoint
  - Updated E2E tests to use correct DTO type
  - Fixed email FROM address assertion to match test environment config
  - All backend E2E tests passing (1 test suite, 1 test)

#### Frontend Test Linting
- **ESLint Import Warnings**: Fixed `import/no-named-as-default` warnings
  - Renamed `userEvent` import to `user` in test files
  - Updated all test usages from `user` variable to `userInteraction`
  - Affects `action.test.tsx` and `range-form.test.tsx`
  - All tests passing with no lint errors

### Added

#### Pre-commit Linting with Husky
- **Husky v9**: Git hooks management for automated quality checks
- **lint-staged v15**: Run linters only on staged files
- **Pre-commit Hook**: Automatically formats and lints code before commit
  - Backend: Prettier + ESLint on TypeScript files
  - Frontend: Prettier + ESLint on TypeScript/TSX files
  - Prevents commits with linting errors
  - Auto-fixes issues when possible

#### CI/CD Test Integration
- **Backend Test Job**: Added automated testing to GitHub Actions workflow
  - PostgreSQL and MongoDB service containers with health checks
  - Unit tests: 10 suites, 38 tests
  - E2E tests: Full API integration tests
  - Test environment variables configured for CI
  - Blocks deployment if tests fail
- **Frontend Test Job**: Added automated testing to GitHub Actions workflow
  - Unit/Integration tests: 20 suites, 149 tests
  - E2E tests: Playwright with Chromium browser
  - MSW mocking for backend API
  - Playwright reports uploaded as artifacts on failure
  - Blocks deployment if tests fail
- **Pipeline Flow**: Updated deployment workflow with quality gates
  - Tests run after linting/formatting
  - Docker builds only proceed if tests pass
  - Deploy job checks all test results before deployment
- **ClickUp Updates**: 
  - Updated CI/CD pipeline ticket (#8699xx3r9) with implementation details
  - Created coverage reporting ticket (#869aw5ju8) for future enhancement

#### Frontend Testing Improvements (Phase 1)
- **Babel Update**: Upgraded Babel from 7.18.5 to 7.25.9 to fix MSW compatibility issues
  - Updated `@babel/core`, `@babel/cli`, `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`, `@babel/runtime`
- **MSW Handler Refactoring**: Reorganized MSW handlers into domain-based structure
  - Created `handlers/auth.handlers.ts` for authentication endpoints
  - Created `handlers/user.handlers.ts` for user management endpoints
  - Default handlers provide happy-path responses (no hardcoded test triggers)
  - Separate named error handlers for testing failure scenarios (`authErrorHandlers`, `userErrorHandlers`)
  - Removed hardcoded test values like `"fail@test.com"`, `"wronguser"`, `"ServerError#7"`
  - Tests now use MSW runtime handlers instead of Jest module mocks for proper Redux integration
- **Test Fixes**: Fixed all 8 existing test files that were failing due to Babel version mismatch
  - Fixed `account.test.tsx`: Updated to use role-based queries, MSW error handlers, and proper Redux state testing
  - Fixed `login.test.tsx`, `register.test.tsx`, `new-password.test.tsx`: Updated to use organized MSW error handlers
  - Fixed `reset-password.test.tsx`: Simplified assertions for missing success/error message UI
  - All 30 tests passing (8 test suites)
- **Build Verification**: Confirmed webpack build works correctly with Babel 7.25.9
- **Test Infrastructure Baseline**: Established working test baseline for future coverage expansion

#### Frontend Testing Improvements (Phase 2 - Range Management)
- **Range Slice Tests**: Comprehensive Redux state management tests (17 tests)
  - Async thunks for fetch, create, update, delete operations
  - Error handling and loading states
  - Reducers and selectors
- **useRange Hook Tests**: Hook integration with Redux (5 tests)
- **Range Component Tests**: Complete UI testing for core feature (38 tests)
  - `range-grid.test.tsx`: Grid display and cell interaction (7 tests)
  - `range-builder.test.tsx`: Full builder flow and CRUD operations (11 tests)
  - `range-form.test.tsx`: Form validation and submission (9 tests)
  - `range-selector.test.tsx`: Selection UI (5 tests)
- **MSW Range Handlers**: Created `handlers/range.handlers.ts` with error scenarios
- **Test Results**: 83 tests passing across 14 test suites with 0 lint errors

#### Frontend Testing Improvements (Phase 3 - Additional Component Coverage)
- **User Slice Tests**: Redux auth state management (13 tests)
  - Async thunks for login, logout, signup, reset, newPassword, validate, resendVerification
  - Reducers for setUser and clearState
- **Theme Slice Tests**: Redux theme switching (7 tests)
  - Initial state loading from localStorage
  - Theme persistence and mode changes
- **useUser Hook Tests**: User auth hook integration (8 tests)
  - State updates and Redux integration
  - Error handling and state cleanup
- **Form Select Component Tests**: Form integration tests (9 tests)
  - Rendering with labels and options
  - Initial values and disabled states
- **Action Component Tests**: Poker action UI (10 tests)
  - Percentage input with debounced onChange
  - Input validation and clamping (0-100)
  - Different action types (RAISE, CALL, FOLD)
- **Table Component Tests**: Generic data table (10 tests)
  - Dynamic headers from object keys
  - Multi-row and multi-column rendering
- **MSW Handler Extensions**: Added handlers for logout, resend-verification, confirm endpoints
- **Test Results**: 149 tests passing across 20 test suites with 0 lint errors

#### Frontend Testing Improvements (Phase 4 - E2E Testing)
- **Playwright Setup**: Installed and configured Playwright for E2E testing
  - Configuration for Chromium browser
  - Auto-start dev server before tests
  - HTML reporter with trace on failure
  - Browser binaries installed
- **Authentication E2E Tests**: Basic page rendering tests (4 tests)
  - Login page displays with all form elements
  - Register page displays with all form elements
  - Navigation links are present and have correct hrefs
- **Protected Routes E2E Tests**: Auth redirect behavior (2 tests)
  - Unauthenticated users redirected to login
  - Root route redirects to login when not authenticated
- **NPM Scripts**: Added E2E test commands
  - `npm run test:e2e` - Run E2E tests
  - `npm run test:e2e:ui` - Run with UI mode
  - `npm run test:e2e:debug` - Run with debugger
- **Documentation**: Created `e2e/README.md` with setup and usage instructions
- **Test Results**: 6 E2E tests covering critical page rendering and auth redirects
- **Note**: Form validation and authenticated flows are covered by unit/component tests; E2E focuses on basic smoke tests

#### Backend Testing Improvements (Complete)
- **Jest Setup**: Created `jest.setup.ts` for automatic mock reset and test isolation
- **Mock Helpers**: Added `resetConfigurationServiceMock()` helper in `mocks.ts` for DRY mock management
- **Test Quality**: Added `await` keywords to all async test expectations to prevent silent test failures
- **Module Test Coverage**: Complete unit and controller test coverage for all major modules
  - Auth Module: 93.18% coverage with strategy testing
  - Files Module: 100% coverage with AWS S3 mocking (17 tests)
  - Ranges Module: 100% coverage with MongoDB/Mongoose mocking (24 tests)
  - Users Module: 81.7% coverage with validation testing
  - App Controller: 100% coverage for health endpoint (3 tests)
- **Test Coverage Achievement**: Increased from 45.79% to 73.38% overall coverage
  - 82 tests passing across 13 test suites
  - 0 lint errors
  - All critical business logic covered
- **E2E Testing Support**: Complete local E2E testing setup
  - Fixed ConfigurationService to properly handle TEST environment (no AWS SSM dependency)
  - Created `.test.env` and `.test.env.example` for test environment configuration
  - Added comprehensive E2E testing guide in `apps/backend/E2E_TESTING.md`
  - Updated README with E2E setup instructions and troubleshooting
  - Existing E2E tests (user.e2e-spec.ts) cover full authentication flow
  - Developers can run E2E tests locally with `docker-compose up postgres mongodb -d && npm run test:e2e`

#### MCP (Model Context Protocol) Integration
- **MCP Server**: Created `tools/texas-mcp-server` providing AI agents with automatic project context
- **Context Tools**: Implemented tools for project state, codebase summary, user preferences, and agent information
- **Agent Coordination Tools**: Added `plan_task_with_agents`, `get_agent_context`, `track_agent_work`, and work log management
- **ClickUp MCP Server**: Created `tools/clickup-mcp-server` for task management integration
  - Browse ClickUp spaces, lists, and tasks directly from AI
  - Create and update tasks with priorities, tags, and assignees
  - Filter tasks by status, assignee, and tags
  - Automated task tracking and progress monitoring
  - Secure authentication via Personal API Token with environment variables
- **Cursor Integration**: Configured `.cursor/mcp.json` for seamless AI assistant integration
- **Automatic Context**: AI agents now automatically access git status, running services, tech stack, and user preferences

#### Development Workflow Enhancements
- **User Preferences System**: Centralized user preferences (Overmind greeting, code style, workflow rules) in MCP server
- **Automatic Agent Coordination**: AI automatically delegates work to specialized agents (backend-architect, frontend-developer, documentation-expert, test-automator, devops-engineer)
- **Commit Workflow Rules**: Established explicit approval process - AI never commits without user request
- **Multi-Agent Orchestration**: AI automatically plans, coordinates, and tracks work across multiple specialized agents

### Changed

#### Backend Testing Infrastructure
- **Mock Management**: Refactored ConfigurationService mock to use centralized helper function
- **Test Isolation**: Automatic mock reset via Jest setup file ensures clean state between tests
- **DRY Principle**: Eliminated duplicate mock implementations across test files
- **Flexibility**: Tests can override default mocks when needed while maintaining DRY code

#### AI Assistant Configuration
- **User Addressing**: Updated to address user as "Overmind" with appropriate AI self-reference as "cerebrate/underling"
- **Workflow Process**: Changed to require explicit user approval before commits (Make changes → Review → User requests commit)
- **Agent Coordination**: AI now proactively uses agent system for all non-trivial tasks without user prompting
- **Documentation Rules**: Added automatic agent coordination rules to `.cursorrules` for consistent AI behavior

#### Claude Agent System Improvements
- **Agent Reference Fixes**: Updated `.claude/CLAUDE.md` to reference actual agent filenames (frontend-developer.md, backend.md, devops-engineer.md, test-automator.md, documentation-expert.md)
- **Agent Streamlining**: Removed redundant project context from all agent files in `.claude/agents/`
- **Documentation Consolidation**: Agents now reference existing project documentation (CONTRIBUTING.md, service READMEs, docs/architecture.md) instead of duplicating content
- **System Architecture**: Simplified agent coordination model by removing non-existent project-manager and architect agents
- **Maintainability**: Established single source of truth for project context in CONTRIBUTING.md, reducing duplication across 5+ agent files

### Fixed

#### Backend Unit Tests
- **ConfigurationService Mock**: Fixed failing `sendEmailLink` tests by ensuring `EMAIL_FROM` is properly mocked after Jest's `resetMocks`
- **Async Test Handling**: Added missing `await` keywords to 25+ async test expectations across all test files
- **Test Reliability**: Eliminated potential for silent test failures and flaky test behavior

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
