import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { Account } from '../../db/entities/account.entity';

import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { BalanceThrottleGuard } from './balance-throttle.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    ThrottlerModule.forRoot({
      ttl: 60 * 60 * 24,
      limit: 10,
    }),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: APP_GUARD,
      useClass: BalanceThrottleGuard,
    },
  ],
})
export class AccountModule {}
