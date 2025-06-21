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
      envFilePath: `.${process.env.NODE_ENV}.env`, // ? Maybe we can use a .env file instead
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION, NODE_ENV.TEST),
        // ? Can I use the enum instead of all the values?
        AWS_REGION: Joi.string().required(),
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
        EMAIL_USER: Joi.string(),
        EMAIL_PASSWORD: Joi.string(),
        UI_URL: Joi.string(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigModule {}
