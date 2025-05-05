// NestJS
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

// Bootstrap module
import { AppModule } from './app.module';

// Middleware
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { config as awsConfig } from 'aws-sdk';

/**
 * Bootstrap application
 */
async function bootstrap() {
  // Create app from AppModule
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  awsConfig.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  // Enable cors for FE (include credentials cookie)
  // TODO - Rethink how to implement CORS on multiple origins
  app.enableCors({ origin: configService.get('UI_URL'), credentials: true });

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

  // Obtain port from env vars
  const PORT = configService.get('PORT');
  // Listen on port
  await app.listen(PORT || 3000);
}

bootstrap();
