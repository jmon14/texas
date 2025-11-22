// NestJS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Constants
import { ConfigModule } from '../config/config.module';
import { ConfigurationService } from '../config/configuration.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NODE_ENV } from '../utils/constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) => {
        const isDevelopment = process.env.NODE_ENV === NODE_ENV.DEVELOPMENT;
        return {
          type: 'postgres',
          host: await configurationService.get('POSTGRES_HOST'),
          port: +(await configurationService.get('POSTGRES_PORT')),
          username: await configurationService.get('POSTGRES_USER'),
          password: await configurationService.get('POSTGRES_PASSWORD'),
          database: await configurationService.get('POSTGRES_DB'),
          entities: [__dirname + '/../**/*.entity.{ts,js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          synchronize: false,
          migrationsRun: isDevelopment,
        };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) => ({
        uri: await configurationService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
