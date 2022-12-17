import { ApiProperty } from '@nestjs/swagger';

export class TransactionListDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  transactionDate: Date;
}

export class TransactionHistoryDto {
  @ApiProperty({ type: [TransactionListDto] })
  transactions: TransactionListDto[];

  @ApiProperty()
  total: number;
}
