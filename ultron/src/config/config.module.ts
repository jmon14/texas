// NestJS
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

// External
import * as Joi from 'joi';

// Config
import { ConfigurationService } from './configuration.service';

// Constants
import { NODE_ENV } from '../utils/constants';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid(...Object.values(NODE_ENV)),
        AWS_REGION: Joi.string().default('eu-central-1'),
        PORT: Joi.number().default(3000),
        POSTGRES_PORT: Joi.number().default(5432),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        DOMAIN: Joi.string(),
        POSTGRES_HOST: Joi.string(),
        POSTGRES_USERNAME: Joi.string(),
        POSTGRES_PASSWORD: Joi.string(),
        POSTGRES_DB: Joi.string(),
        JWT_SECRET: Joi.string(),
        JWT_EXPIRATION_TIME: Joi.number(),
        JWT_REFRESH_SECRET: Joi.string(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.number(),
        JWT_EMAIL_SECRET: Joi.string(),
        JWT_EMAIL_EXPIRATION_TIME: Joi.number(),
        UI_URL: Joi.string(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string(),
        AWS_SES_SMTP_USERNAME: Joi.string(),
        AWS_SES_SMTP_PASSWORD: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigModule {}
