import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Transaction } from '../../db/entities/transaction.entity';

import { TransactionListQueryDto } from './dto/transaction.request.dto';
import { TransactionHistoryDto } from './dto/transaction.response.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getTransactionHistoryList(
    query: TransactionListQueryDto,
    ip: string,
  ): Promise<TransactionHistoryDto> {
    const [transactions, total] = await this.transactionRepository
      .createQueryBuilder('t')
      .leftJoin('t.account', 'account')
      .leftJoin('account.client', 'client')
      .where('client.ip = :ip', { ip })
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    return { transactions, total };
  }
}
