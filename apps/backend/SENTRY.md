# Sentry Integration Guide

This document describes the Sentry error tracking integration in the Texas Poker backend application.

## Overview

Sentry is integrated to automatically track and report errors in production, helping us identify and fix issues quickly. The integration is **disabled in development** to avoid polluting error tracking with local development issues.

## Architecture

### Components

1. **`src/instrument.ts`** - Sentry initialization (must be imported first)
2. **`src/filters/sentry-exception.filter.ts`** - Global exception filter for automatic error capture
3. **`src/main.ts`** - Application bootstrap that conditionally applies the filter

### Configuration Files

- **Production**: Environment variables from SSM Parameter Store
- **Development**: Local environment variables (optional)
- **Build**: `tsconfig.build.json` ensures correct output structure

## How It Works

### Environment-Based Initialization

Sentry only initializes in **production** environments:

```typescript
// instrument.ts
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: `backend@${version}+${gitSha}`,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  });
}
```

**Development mode:**
- ⏭️ Sentry disabled
- ❌ No errors sent to Sentry
- ✅ Console logs: "Sentry disabled in development mode"

**Production mode:**
- ✅ Sentry initialized
- ✅ Errors tracked and sent to Sentry
- ✅ Console logs: "Sentry initialized for production environment"

### Release Tracking

Each deployment is tracked with a unique release identifier:

**Format:** `backend@{version}+{git-sha}`

**Example:** `backend@2.0.1+a3f5c9d7e2b`

This allows you to:
- Know exactly which commit caused an error
- Track errors by semantic version
- Correlate Sentry issues with GitHub commits

### Trace Sampling

**Production:** 10% of transactions captured (configurable via `SENTRY_TRACES_SAMPLE_RATE`)
- Balances visibility with cost
- Sufficient for most production monitoring

**Development:** Not applicable (Sentry disabled)

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (production/development) | `development` | Yes |
| `SENTRY_DSN` | Sentry Data Source Name | Hardcoded fallback | Production only |
| `SENTRY_TRACES_SAMPLE_RATE` | Percentage of traces to capture (0.0-1.0) | `0.1` | No |
| `GIT_SHA` | Git commit SHA for release tracking | `dev` | No |

### Production Configuration

In production, environment variables are set via:

1. **SSM Parameter Store:** `/texas/backend/SENTRY_DSN`
2. **docker-compose.prod.yml:** Environment variable injection
3. **deploy.sh:** Fetches values from SSM and creates `.env` file

### Local Development

Sentry is **automatically disabled** in development. No configuration needed!

If you want to test Sentry locally:

```bash
# Enable Sentry for local testing
NODE_ENV=production \
SENTRY_DSN="https://your-dsn@sentry.io/project" \
SENTRY_TRACES_SAMPLE_RATE=1.0 \
GIT_SHA="local-test" \
npm run start:dev
```

## Deployment

### GitHub Actions Workflow

When deploying to production:

1. **Build:** Docker image built with commit SHA
2. **Deploy:** `deploy.sh` fetches `SENTRY_DSN` from SSM
3. **Environment:** Variables injected into container
4. **Startup:** Sentry initializes with release info
5. **Tracking:** Errors automatically sent to Sentry

### Release Versioning

The version comes from `package.json`:

```typescript
// instrument.ts
import packageJson from '../package.json';
const packageVersion = packageJson.version;  // e.g., "2.0.1"
```

To bump version manually:

```bash
cd apps/backend

# Patch version (2.0.0 → 2.0.1)
npm version patch

# Minor version (2.0.0 → 2.1.0)
npm version minor

# Major version (2.0.0 → 3.0.0)
npm version major

# Commit and push
git push && git push --tags
```

**Future:** Automated versioning with semantic-release (see ClickUp ticket)

## Error Tracking

### Automatic Capture

All unhandled exceptions are automatically captured via the global exception filter:

```typescript
// Any error in your application
throw new Error('Something went wrong');

// Automatically sent to Sentry with:
// - Full stack trace
// - Request context
// - User information (if available)
// - Environment details
// - Release version
```

### Manual Capture

For specific error tracking:

```typescript
import * as Sentry from '@sentry/nestjs';

try {
  // Some risky operation
  await someAsyncOperation();
} catch (error) {
  // Add extra context before capturing
  Sentry.captureException(error, {
    tags: {
      feature: 'authentication',
      action: 'login',
    },
    extra: {
      userId: user.id,
      attemptCount: attempts,
    },
  });
  
  // Re-throw or handle
  throw error;
}
```

### Adding Context

```typescript
import * as Sentry from '@sentry/nestjs';

// Set user context
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});

// Add breadcrumbs
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User login attempt',
  level: 'info',
});

// Set custom tags
Sentry.setTag('feature', 'ranges');
Sentry.setContext('game', {
  handId: hand.id,
  players: hand.players.length,
});
```

## Viewing Errors in Sentry

1. **Dashboard:** https://sentry.io/organizations/texas-poker/
2. **Filter by release:** Search for `backend@2.0.1+a3f5c9d`
3. **View details:** Click on an issue to see:
   - Stack trace
   - Request details
   - User context
   - Breadcrumbs
   - Related commits (via release)

## Best Practices

### ✅ Do:

- Let errors bubble up naturally for automatic capture
- Add context before capturing errors manually
- Use tags for categorization (feature, action, etc.)
- Set user context when available
- Monitor Sentry dashboard regularly

### ❌ Don't:

- Don't capture expected errors (validation errors, 404s, etc.)
- Don't enable Sentry in development (it's automatic)
- Don't log sensitive data (passwords, tokens, etc.)
- Don't ignore high-volume errors
- Don't forget to resolve fixed issues in Sentry

## Troubleshooting

### Sentry Not Capturing Errors in Production

1. Check environment:
   ```bash
   # In production container
   echo $NODE_ENV  # Should be "production"
   echo $SENTRY_DSN  # Should be set
   ```

2. Check logs:
   ```bash
   docker-compose -f infrastructure/docker-compose.prod.yml logs backend | grep Sentry
   # Should see: "✅ Sentry initialized for production environment"
   ```

3. Verify SSM parameter exists:
   ```bash
   aws ssm get-parameter --name "/texas/backend/SENTRY_DSN" --with-decryption
   ```

### Errors Still Showing in Development

Check that `NODE_ENV=development`:

```bash
npm run start:dev
# Console should show: "⏭️ Sentry disabled in development mode"
```

### Release Version Not Showing Correctly

1. Check `package.json` version is updated
2. Verify `GIT_SHA` environment variable is set
3. Check Sentry initialization logs for release value

## Infrastructure

### SSM Parameter Store

**Parameter:** `/texas/backend/SENTRY_DSN`
- **Type:** SecureString (encrypted)
- **Managed by:** Terraform (`infrastructure/aws/ssm.tf`)
- **Access:** EC2 instance IAM role

### Terraform Configuration

```hcl
# infrastructure/aws/ssm.tf
resource "aws_ssm_parameter" "sentry_dsn" {
  name        = "/texas/backend/SENTRY_DSN"
  description = "Sentry DSN for error tracking"
  type        = "SecureString"
  value       = var.sentry_dsn
}
```

### Docker Compose

```yaml
# infrastructure/docker-compose.prod.yml
backend:
  environment:
    - NODE_ENV=production
    - SENTRY_DSN=${SENTRY_DSN}
    - SENTRY_TRACES_SAMPLE_RATE=0.1
    - GIT_SHA=${BACKEND_TAG:-latest}
```

## Future Improvements

### Automated Versioning (Planned)

See ClickUp ticket: "Implement semantic-release for automated versioning"

Once implemented:
- Versions bump automatically based on commit messages
- Changelog generated automatically
- Releases tracked in both GitHub and Sentry

### Source Maps (Optional)

Upload source maps to Sentry for better stack traces:

```bash
# After build
npx @sentry/cli releases files "backend@2.0.1" upload-sourcemaps ./dist
```

### Performance Monitoring (Optional)

Increase `tracesSampleRate` for more detailed performance tracking:

```bash
# In SSM or docker-compose
SENTRY_TRACES_SAMPLE_RATE=0.5  # 50% of transactions
```

## Support

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/nestjs/
- **Project Dashboard:** https://sentry.io/organizations/texas-poker/
- **Contact:** Check internal documentation for Sentry admin access

## Summary

- ✅ **Automatic error tracking** in production
- ⏭️ **Disabled in development** (no setup needed)
- 🎯 **Release tracking** with version + git SHA
- 📊 **10% trace sampling** for performance insights
- 🔐 **Secure configuration** via SSM Parameter Store
- 🚀 **Zero developer overhead** - just works!

