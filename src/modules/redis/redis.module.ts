import { Module } from '@nestjs/common';
import { RedisModule as RM } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RM.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';
        return {
          config: {
            host: isProd
              ? config.get('REDIS_HOST_PROD')
              : config.get('REDIS_HOST_LOCAL'),
            port: isProd
              ? config.get('REDIS_PORT_PROD')
              : config.get('REDIS_PORT_LOCAL'),
          },
        };
      },
    }),
  ],
})
export class RedisModule {}
