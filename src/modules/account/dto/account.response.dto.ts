import { ApiProperty } from '@nestjs/swagger';
import exp from 'constants';

export class ClientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  document: string;

  @ApiProperty()
  ip: string;
}

export class AccountResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  dailyWithdrawalLimit: number;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  accountType: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: ClientResponseDto })
  client: ClientResponseDto;
}

export class BalanceResponseDto {
  @ApiProperty()
  balance: number;
}
