# E2E Testing Guide

This guide explains how to run End-to-End (E2E) tests locally for the Texas Poker backend.

## Quick Start

```bash
# 1. Start databases (from project root)
docker-compose up postgres mongodb -d

# 2. Run E2E tests (from apps/backend)
npm run test:e2e
```

## Prerequisites

### Required Services

E2E tests require:
- **PostgreSQL** (port 5432)
- **MongoDB** (port 27017)

Both can be started using Docker Compose from the project root.

### Environment Configuration

E2E tests use the `.test.env` file which is automatically loaded when `NODE_ENV=test`.

Key settings:
- PostgreSQL: `localhost:5432` → database `texas_test`
- MongoDB: `localhost:27017` → database `texas_test`
- All secrets use test values
- Email service is mocked (no actual emails sent)

## Running E2E Tests

### Start Databases

From the **project root** (`/Users/jorgemontero/workspace/texas`):

```bash
# Start only databases
docker-compose up postgres mongodb -d

# Check they're running
docker ps | grep -E 'postgres|mongodb'
```

### Run Tests

From the **backend directory** (`apps/backend`):

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- user.e2e-spec.ts

# Run with verbose output
npm run test:e2e -- --verbose
```

## Current E2E Test Coverage

### ✅ Current E2E Tests
- **user.e2e-spec.ts**: User management and authentication flow
  - User creation and email verification
  - Password reset flow
  - JWT token validation
  - Duplicate username/email handling

### 📝 Note on Additional E2E Coverage

The existing E2E test provides comprehensive coverage of the critical authentication flow, which is the most complex integration path in the application. Additional E2E tests for individual endpoints (Files, Ranges, Auth) are not necessary at this time because:

1. **Strong Unit Test Coverage**: All modules have 80-100% unit test coverage with proper mocking
2. **Integration Coverage**: The user.e2e-spec.ts test validates database connections, JWT flow, and email service integration
3. **Test Pyramid**: Following best practices, we focus on extensive unit tests and targeted E2E tests for critical paths
4. **CI/CD Future**: Additional E2E tests can be added as part of CI/CD pipeline work if needed

## Troubleshooting

### Database Connection Errors

If tests fail with "Cannot read properties of undefined (reading 'getParameter')":
- ✅ **FIXED**: Updated `ConfigurationService` to handle TEST environment

If tests fail with database connection errors:

1. **Verify databases are running**:
   ```bash
   docker-compose ps
   ```

2. **Check PostgreSQL**:
   ```bash
   docker-compose logs postgres
   # Should see: "database system is ready to accept connections"
   ```

3. **Check MongoDB**:
   ```bash
   docker-compose logs mongodb
   # Should see: "Waiting for connections"
   ```

4. **Restart databases**:
   ```bash
   docker-compose restart postgres mongodb
   ```

5. **Clean restart** (removes all data):
   ```bash
   docker-compose down -v
   docker-compose up postgres mongodb -d
   ```

### Port Conflicts

If ports 5432 or 27017 are already in use:

```bash
# Check what's using the ports
lsof -i :5432
lsof -i :27017

# Stop conflicting services or change ports in docker-compose.yml
```

### Environment Issues

If `.test.env` is not being loaded:

```bash
# Verify file exists
ls -la apps/backend/.test.env

# Verify NODE_ENV is set
npm run test:e2e -- --verbose | grep NODE_ENV
```

## Test Database Management

### Automatic Cleanup

The E2E tests automatically clean the database before each test using:
```typescript
beforeEach(async () => {
  await repository.delete({});
});
```

### Manual Cleanup

To manually reset test databases:

```bash
# PostgreSQL
docker-compose exec postgres psql -U admin -d texas_test -c "TRUNCATE TABLE users, files CASCADE;"

# MongoDB
docker-compose exec mongodb mongosh texas_test --eval "db.dropDatabase()"
```

## CI/CD Integration

E2E tests run automatically in the CI/CD pipeline with:
- **Containerized databases** (PostgreSQL and MongoDB service containers)
- **Automatic database migrations** run before E2E tests
- **Environment variables** configured in workflow (see `.github/workflows/deploy.yml`)
- **Standard Jest format** for test results

### CI/CD Migration Flow
```yaml
1. Install dependencies
2. Run unit tests
3. Run migrations (npm run migrate)
4. Run E2E tests (npm run test:e2e)
```

Migrations use `ts-node` to run directly from TypeScript source, ensuring the `texas_test` database has all required tables before tests run.

## Best Practices

1. **Always start databases before running E2E tests**
2. **Use separate test databases** (`texas_test`) to avoid affecting development data
3. **Mock external services** (AWS S3, SES) in E2E tests
4. **Keep E2E tests focused** on critical user flows
5. **Unit tests first** - E2E tests are for integration validation

## Related Documentation

- [Backend README](./README.md) - Full backend documentation
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Development workflow
- [docker-compose.yml](../../docker-compose.yml) - Service configuration

