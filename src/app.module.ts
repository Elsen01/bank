import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AccountModule } from './modules/account/account.module';
import { typeormConfig } from './configs/typeorm.config';
import { AuthIpGuard } from './modules/auth/auth-ip.guard';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeormConfig),
    AccountModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [AuthIpGuard],
})
export class AppModule {}
