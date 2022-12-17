import { Controller, Get, UseGuards, Query, Ip } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TransactionService } from './transaction.service';
import { AuthIpGuard } from '../auth/auth-ip.guard';
import { TransactionListQueryDto } from './dto/transaction.request.dto';
import { TransactionHistoryDto } from './dto/transaction.response.dto';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @UseGuards(AuthIpGuard)
  @ApiOperation({ summary: 'transaction history' })
  @ApiOkResponse({ type: TransactionHistoryDto })
  async getTransactionHistory(
    @Query() query: TransactionListQueryDto,
    @Ip() ip: string,
  ): Promise<TransactionHistoryDto> {
    return await this.transactionService.getTransactionHistoryList(query, ip);
  }
}
