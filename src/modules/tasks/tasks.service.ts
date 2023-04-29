import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Repository } from 'typeorm';

import { Score } from '../database/entities/score.entity';
import redisKeys from '../common/constants/redisKeys';

@Injectable()
export class TasksService {
  @InjectRepository(Score)
  private readonly scoreRepository: Repository<Score>;
  @InjectRedis()
  private readonly redis: Redis;

  // CronExpression.EVERY_WEEK for weekly
  @Cron(CronExpression.EVERY_HOUR)
  async resetLeaderboardAndDistributePrizes() {
    const pool = +(await this.redis.get(redisKeys.PRIZEPOOL));
    const firstHundred = await this.redis.zrevrange(
      redisKeys.LEADERBOARD,
      '0',
      '99',
    );

    const firstPlacePrize = Math.floor(pool * 0.2);
    const secondPlacePrize = Math.floor(pool * 0.15);
    const thirdPlacePrize = Math.floor(pool * 0.1);

    const queryRunner =
      this.scoreRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.increment(
        Score,
        { userId: +firstHundred.shift() },
        'score',
        firstPlacePrize,
      );

      await queryRunner.manager.increment(
        Score,
        { userId: +firstHundred.shift() },
        'score',
        secondPlacePrize,
      );

      await queryRunner.manager.increment(
        Score,
        { userId: +firstHundred.shift() },
        'score',
        thirdPlacePrize,
      );

      for (let i = 0; i < firstHundred.length; i++) {
        await queryRunner.manager.increment(
          Score,
          { userId: +firstHundred[i] },
          'score',
          Math.floor(
            ((55 / 97 + (((Math.floor(97 / 2) - i) / 100) * 55) / 97) / 100) *
              pool,
          ),
        );
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      await this.redis.del(redisKeys.PRIZEPOOL);
      await this.redis.del(redisKeys.LEADERBOARD);
    }
  }
}
