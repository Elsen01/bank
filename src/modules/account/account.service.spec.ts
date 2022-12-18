import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { BadRequestException } from '@nestjs/common';

import { Account } from '../../db/entities/account.entity';

import { CreateAccountDto, CreateClientDto } from './dto/account.request.dto';
import {
  AccountResponseDto,
  ClientResponseDto,
} from './dto/account.response.dto';

const accountResponse = new AccountResponseDto();
accountResponse.accountType = 1;
accountResponse.balance = 0;
accountResponse.active = true;
accountResponse.createdAt = new Date();
accountResponse.id = 'ass-231asd-awq';
accountResponse.dailyWithdrawalLimit = 10;
accountResponse.client = {
  id: '11a',
  name: 'demo',
  document: 'document',
} as ClientResponseDto;

const account = {
  balance: 0,
  createdAt: new Date(),
  id: '12',
  active: true,
  accountType: 1,
  dailyWithdrawalLimit: 10,
};

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({
    createQueryRunner: () => {
      return {
        startTransaction: () => ({}),
        commitTransaction: () => ({}),
        release: () => ({}),
        rollbackTransaction: () => ({}),
        manager: { save: jest.fn().mockReturnValue(accountResponse) },
      };
    },
    getRepository: () => {
      return {
        findOne: () => null,
        save: () => null,
        query: () => [{ value: 0 }],
      };
    },
  }),
);

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: Repository<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            save: () => ({}),
            createQueryBuilder: () => {
              return {
                leftJoin: () => {
                  return {
                    where: () => {
                      return { getOne: () => ({}) };
                    },
                  };
                },
              };
            },
          },
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    accountRepository = module.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const clientDto = new CreateClientDto();
    clientDto.name = 'Demo client';
    clientDto.document = 'document';

    const accountDto = new CreateAccountDto();
    accountDto.client = clientDto;
    accountDto.accountType = 1;

    it('createAccount success', async () => {
      const response = await service.createAccount(accountDto, '::1');

      expect(response.id).toBe(accountResponse.id);
      expect(response.balance).toBe(accountResponse.balance);
      expect(response.accountType).toBe(accountResponse.accountType);
      expect(response.dailyWithdrawalLimit).toBe(
        accountResponse.dailyWithdrawalLimit,
      );
      expect(response.client.ip).toBe(accountResponse.client.ip);
      expect(response.client.id).toBe(accountResponse.client.id);
    });

    it('createAccount fail if account exist', async () => {
      jest.spyOn(service, 'existAccountByIp').mockImplementation(async () => {
        return {} as any;
      });

      await expect(service.createAccount(accountDto, '::1')).rejects.toThrow(
        new BadRequestException('ACCOUNT ALREADY EXIST'),
      );
    });
  });

  describe('blockAccount', () => {
    it('blockAccount success', async () => {
      jest.spyOn(service, 'getAccountByIp').mockImplementation(async () => {
        return account as any;
      });

      jest.spyOn(accountRepository, 'save').mockImplementation(async () => {
        return { ...account, active: false } as any;
      });

      const response = await service.blockAccount('::1');

      expect(response.active).toBeFalsy();
    });

    it('blockAccount fail if account already blocked ', async () => {
      jest.spyOn(service, 'getAccountByIp').mockImplementation(async () => {
        return { ...account, active: false } as any;
      });

      await expect(service.blockAccount('::1')).rejects.toThrow(
        new BadRequestException('ACCOUNT ALREADY BLOCKED'),
      );
    });
  });

  describe('getBalance', () => {
    it('getBalance success', async () => {
      jest.spyOn(service, 'getAccountByIp').mockImplementation(async () => {
        return { ...account, active: false } as any;
      });

      const response = await service.getBalance('::1');

      expect(response.balance).toBe(0);
    });
  });

  describe('withdraw', () => {
    it('withdraw success', async () => {
      jest.spyOn(service, 'getAccountByIp').mockImplementation(async () => {
        return { ...account, balance: 20, active: true } as any;
      });

      const response = await service.withdraw({ amount: 10 }, '::1');

      expect(response).toBeDefined();
    });

    it('withdraw fail if balance less then amount', async () => {
      jest.spyOn(service, 'getAccountByIp').mockImplementation(async () => {
        return { ...account, balance: 5, active: true } as any;
      });

      await expect(service.withdraw({ amount: 10 }, '::1')).rejects.toThrow(
        new BadRequestException('AMOUNT EXCEEDS THE BALANCE'),
      );
    });

    it('withdraw fail if account blocked', async () => {
      jest.spyOn(service, 'getAccountByIp').mockImplementation(async () => {
        return { ...account, balance: 10, active: false } as any;
      });

      await expect(service.withdraw({ amount: 10 }, '::1')).rejects.toThrow(
        new BadRequestException('ACCOUNT BLOCKED'),
      );
    });
  });

  describe('replenishment', () => {
    it('replenishment success', async () => {
      jest.spyOn(service, 'getAccountByIp').mockImplementation(async () => {
        return { ...account, balance: 20, active: true } as any;
      });

      const response = await service.replenishment({ amount: 10 }, '::1');

      expect(response).toBeDefined();
    });
  });

  it('replenishment fail if account blocked', async () => {
    jest.spyOn(service, 'getAccountByIp').mockImplementation(async () => {
      return { ...account, balance: 10, active: false } as any;
    });

    await expect(service.replenishment({ amount: 10 }, '::1')).rejects.toThrow(
      new BadRequestException('ACCOUNT BLOCKED'),
    );
  });
});
