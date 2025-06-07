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

/**
 * Bootstrap application
 */
async function bootstrap() {
  // Create app from AppModule
  const app = await NestFactory.create(AppModule);

  // Get configuration service
  const configurationService = app.get(ConfigurationService);

  // Only configure AWS credentials in development
  if (await configurationService.get('NODE_ENV') !== NODE_ENV.PRODUCTION) {
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

  // Enable cors for FE (include credentials cookie)
  // TODO - Rethink how to implement CORS on multiple origins
  app.enableCors({ origin: await configurationService.get('UI_URL'), credentials: true });

  // Apply helmet middleware
  app.use(helmet());

  // Apply cookie parser middleware for accepting cookies
  app.use(cookieParser());

  // Globals for excluding entity properties and data validation
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  // Open API documentation
  const config = new DocumentBuilder()
    .setTitle('Ultron')
    .setDescription('Ultron API for Quickview Analytics')
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
  const nodeEnv = await configurationService.get('NODE_ENV');
  console.log(`Starting server on port ${port} in ${nodeEnv} mode`);
  await app.listen(port);
}
bootstrap();
