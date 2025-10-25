import * as Sentry from '@sentry/nestjs';
import { NODE_ENV } from './utils/constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

// Only initialize Sentry in production environment
// Skip in development to avoid polluting error tracking with local dev errors
const nodeEnv = process.env.NODE_ENV || NODE_ENV.DEVELOPMENT;
const isProduction = nodeEnv === NODE_ENV.PRODUCTION;
const dsn = process.env.SENTRY_DSN;
const gitSha = process.env.GIT_SHA;

if (isProduction && dsn && gitSha) {
  if (!dsn || !gitSha) {
    console.error('SENTRY_DSN and GIT_SHA environment variables are required in production');
  } else {
    Sentry.init({
      dsn: dsn,
      environment: nodeEnv,
      release: `backend@${packageJson.version}+${gitSha}`,
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    });
  }
}
