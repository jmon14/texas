import './instrument';

// NestJS
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

// Bootstrap module
import { AppModule } from './app.module';

// Middleware
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { config as awsConfig } from 'aws-sdk';
import { NODE_ENV } from './utils/constants';

// Services
import { ConfigurationService } from './config/configuration.service';

// Filters
import { SentryExceptionFilter } from './filters';

/**
 * Bootstrap application
 */
async function bootstrap() {
  // Create app from AppModule
  const app = await NestFactory.create(AppModule);

  // Get configuration service
  const configurationService = app.get(ConfigurationService);

  // Get node environment
  const nodeEnv = await configurationService.get('NODE_ENV');

  // Only configure AWS credentials in development and test
  if (nodeEnv !== NODE_ENV.PRODUCTION) {
    awsConfig.update({
      accessKeyId: await configurationService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: await configurationService.get('AWS_SECRET_ACCESS_KEY'),
      region: await configurationService.get('AWS_REGION'),
    });
  } else {
    // In production, only set the region
    awsConfig.update({
      region: await configurationService.get('AWS_REGION'),
    });
  }

  // Configure CORS for all environments
  const uiUrl = await configurationService.get('UI_URL');
  app.enableCors({
    origin: [uiUrl],
    credentials: true,
  });

  // Apply helmet middleware
  app.use(helmet());

  // Apply cookie parser middleware for accepting cookies
  app.use(cookieParser());

  // Globals for excluding entity properties and data validation
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  // Global Sentry exception filter for automatic error tracking in production
  if (nodeEnv === NODE_ENV.PRODUCTION) {
    const httpAdapter = app.getHttpAdapter();
    app.useGlobalFilters(new SentryExceptionFilter(httpAdapter));
  }

  // Open API documentation
  const config = new DocumentBuilder()
    .setTitle('Backend')
    .setDescription('Backend API for Texas Poker Application')
    .setVersion('1.0')
    .build();

  // Use methodKey as the name
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  // Create and setup swagger documentation
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  // Get port from config
  const port = await configurationService.get('PORT');
  console.log(`Starting server on port ${port} in ${nodeEnv} mode`);
  await app.listen(port);
}

bootstrap();
