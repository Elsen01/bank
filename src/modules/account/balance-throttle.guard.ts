import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class BalanceThrottleGuard extends ThrottlerGuard {
  protected throwThrottlingException(context: ExecutionContext): void {
    throw new ThrottlerException('BALANCE REQUEST LIMIT EXCEEDED');
  }
}
