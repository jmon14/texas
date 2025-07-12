// NestJS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Constants
import { NODE_ENV } from 'src/utils/constants';
import { ConfigModule } from 'src/config/config.module';
import { ConfigurationService } from 'src/config/configuration.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) => ({
        type: 'postgres',
        host: await configurationService.get('POSTGRES_HOST'),
        port: +(await configurationService.get('POSTGRES_PORT')),
        username: await configurationService.get('POSTGRES_USER'),
        password: await configurationService.get('POSTGRES_PASSWORD'),
        database: await configurationService.get('POSTGRES_DB'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: true, // ! TODO: Do this with migrations instead in production
      }),
    }),
  ],
})
export class DatabaseModule {}
