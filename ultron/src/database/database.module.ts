// NestJS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Constants
import { NODE_ENV } from 'src/utils/constants';
import { ConfigurationService } from '../config/configuration.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) => ({
        type: 'postgres',
        host: await configurationService.get('DB_HOST'),
        port: +await configurationService.get('DB_PORT'),
        username: await configurationService.get('DB_USERNAME'),
        password: await configurationService.get('DB_PASSWORD'),
        database: await configurationService.get('DB_NAME'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: (await configurationService.get('NODE_ENV')) !== NODE_ENV.PRODUCTION,
      }),
    }),
  ],
})
export class DatabaseModule {}
