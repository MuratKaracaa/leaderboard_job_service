import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Score } from './entities/score.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          host: isProd
            ? config.get('DB_HOST_PROD')
            : config.get('DB_HOST_LOCAL'),
          port: parseInt(config.get('PORT')),
          username: isProd
            ? config.get('DB_USER_PROD')
            : config.get('DB_USER_LOCAL'),
          password: isProd
            ? config.get('DB_PASSWORD_PROD')
            : config.get('DB_PASSWORD_LOCAL'),
          database: isProd
            ? config.get('DB_DATABASE_PROD')
            : config.get('DB_DATABASE_LOCAL'),
          synchronize: false,
          entities: [Score],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
