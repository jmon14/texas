import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class SentryExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Capture exception in Sentry (only if Sentry is initialized in production)
    const client = Sentry.getClient();
    if (client) {
      Sentry.captureException(exception);
    }

    // Continue with default exception handling
    super.catch(exception, host);
  }
}
