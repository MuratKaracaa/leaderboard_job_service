import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TasksModule } from '../tasks/tasks.module';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TasksModule,
    DatabaseModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
