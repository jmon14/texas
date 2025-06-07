import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import * as Joi from 'joi';
import { NODE_ENV } from '../utils/constants';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION, NODE_ENV.TEST),
        PORT: Joi.number().default(3000),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        DOMAIN: Joi.string(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        JWT_SECRET: Joi.string(),
        JWT_EXPIRATION_TIME: Joi.number(),
        JWT_REFRESH_SECRET: Joi.string(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.number(),
        JWT_EMAIL_SECRET: Joi.string(),
        JWT_EMAIL_EXPIRATION_TIME: Joi.number(),
        EMAIL_SERVICE: Joi.string(),
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