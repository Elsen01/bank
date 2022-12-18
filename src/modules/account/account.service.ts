import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { startOfToday } from 'date-fns';

import { Account } from '../../db/entities/account.entity';
import { Client } from '../../db/entities/client.entity';
import {
  Transaction,
  TransactionType,
} from '../../db/entities/transaction.entity';

import { AmountMoneyDto, CreateAccountDto } from './dto/account.request.dto';
import {
  AccountResponseDto,
  BalanceResponseDto,
} from './dto/account.response.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async createAccount(
    dto: CreateAccountDto,
    ip: string,
  ): Promise<AccountResponseDto> {
    const exist = await this.existAccountByIp(ip);

    if (exist) {
      throw new BadRequestException(`ACCOUNT ALREADY EXIST`);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const client = new Client();
      client.name = dto.client.name;
      client.document = dto.client.document;
      client.birthDate = dto.client.birthDate;
      client.ip = ip;
      const newClient = await queryRunner.manager.save(client);

      const account = new Account();
      account.accountType = dto.accountType;
      account.client = newClient;
      const newAccount = await queryRunner.manager.save(account);

      await queryRunner.commitTransaction();

      await queryRunner.release();

      return newAccount;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw new InternalServerErrorException('Something wrong');
    }
  }

  async blockAccount(ip: string): Promise<AccountResponseDto> {
    const account = await this.getAccountByIp(ip);

    if (!account.active) {
      throw new BadRequestException(`ACCOUNT ALREADY BLOCKED`);
    }

    account.active = false;

    return await this.accountRepo.save(account);
  }

  async getBalance(ip: string): Promise<BalanceResponseDto> {
    const account = await this.getAccountByIp(ip);

    return { balance: account.balance };
  }

  async withdraw(dto: AmountMoneyDto, ip: string): Promise<AccountResponseDto> {
    const account = await this.getAccountByIp(ip);

    const [dailyWithdraw] = await this.dataSource
      .getRepository(Transaction)
      .query(
        `SELECT SUM(t."value") FILTER (WHERE t."transaction_date" >= '${startOfToday().toISOString()}' AND t."type" = '${
          TransactionType.WITHDRAW
        }')::INT AS value FROM "transaction" t`,
      );

    if (
      dto.amount > account.dailyWithdrawalLimit ||
      (dailyWithdraw.value &&
        dailyWithdraw.value >= account.dailyWithdrawalLimit)
    ) {
      throw new BadRequestException(
        `YOU HAVE EXCEEDED THE DAILY WITHDRAWAL LIMIT`,
      );
    }

    if (!account.active) {
      throw new BadRequestException(`ACCOUNT BLOCKED`);
    }

    if (dto.amount > account.balance) {
      throw new BadRequestException('AMOUNT EXCEEDS THE BALANCE');
    }

    account.balance -= dto.amount;

    return await this.createTransaction(account, dto, TransactionType.WITHDRAW);
  }

  async replenishment(
    dto: AmountMoneyDto,
    ip: string,
  ): Promise<AccountResponseDto> {
    const account = await this.getAccountByIp(ip);

    if (!account.active) {
      throw new BadRequestException(`ACCOUNT BLOCKED`);
    }

    account.balance += dto.amount;

    return await this.createTransaction(
      account,
      dto,
      TransactionType.REPLENISHMENT,
    );
  }

  async getAccountByIp(ip: string) {
    const account = await this.accountRepo
      .createQueryBuilder('a')
      .leftJoin('a.client', 'client')
      .where('client.ip = :ip', { ip })
      .getOne();

    if (!account) {
      throw new NotFoundException(`ACCOUNT NOT FOUND`);
    }

    return account;
  }

  async existAccountByIp(ip: string) {
    return await this.dataSource
      .getRepository(Client)
      .findOne({ where: { ip } });
  }

  private async createTransaction(
    account: Account,
    dto: AmountMoneyDto,
    type: TransactionType,
  ): Promise<AccountResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const transaction = new Transaction();
      transaction.account = account;
      transaction.value = dto.amount;
      transaction.type = type;

      await queryRunner.manager.save(transaction);

      const updatedAccount = await queryRunner.manager.save(account);

      await queryRunner.commitTransaction();

      await queryRunner.release();

      return updatedAccount;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw new InternalServerErrorException('Something wrong');
    }
  }
}
