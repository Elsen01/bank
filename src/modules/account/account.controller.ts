import {
  Controller,
  Post,
  Body,
  Get,
  Ip,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { AccountService } from './account.service';
import { AmountMoneyDto, CreateAccountDto } from './dto/account.request.dto';
import {
  AccountResponseDto,
  BalanceResponseDto,
} from './dto/account.response.dto';
import { AuthIpGuard } from '../auth/auth-ip.guard';

@SkipThrottle()
@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'create new account' })
  @ApiOkResponse({ type: AccountResponseDto })
  @Post()
  async createAccount(
    @Body() dto: CreateAccountDto,
    @Ip() ip: string,
  ): Promise<AccountResponseDto> {
    return await this.accountService.createAccount(dto, ip);
  }

  @UseGuards(AuthIpGuard)
  @ApiOperation({ summary: 'block account' })
  @ApiOkResponse({ type: AccountResponseDto })
  @Patch('block')
  async blockAccount(@Ip() ip: string): Promise<AccountResponseDto> {
    return await this.accountService.blockAccount(ip);
  }

  @SkipThrottle(false)
  @UseGuards(AuthIpGuard)
  @ApiOperation({ summary: 'get balance' })
  @ApiOkResponse({ type: BalanceResponseDto })
  @Get('balance')
  async getBalance(@Ip() ip: string): Promise<BalanceResponseDto> {
    return await this.accountService.getBalance(ip);
  }

  @UseGuards(AuthIpGuard)
  @ApiOperation({ summary: 'withdraw balance' })
  @ApiOkResponse({ type: AccountResponseDto })
  @Patch('balance/withdraw')
  async withdrawMoney(
    @Body() dto: AmountMoneyDto,
    @Ip() ip: string,
  ): Promise<AccountResponseDto> {
    return await this.accountService.withdraw(dto, ip);
  }

  @UseGuards(AuthIpGuard)
  @ApiOperation({ summary: 'replenishment balance' })
  @ApiOkResponse({ type: AccountResponseDto })
  @Patch('balance/replenishment')
  async replenishmentAccount(
    @Body() dto: AmountMoneyDto,
    @Ip() ip: string,
  ): Promise<AccountResponseDto> {
    return await this.accountService.replenishment(dto, ip);
  }
}
