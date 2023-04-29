import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksService } from './tasks.service';
import { Score } from '../database/entities/score.entity';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Score])],
  providers: [TasksService],
})
export class TasksModule {}
