import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsIP,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;
}

export class CreateAccountDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  accountType: number;

  @ApiProperty({ type: CreateClientDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateClientDto)
  client: CreateClientDto;
}

export class AmountMoneyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;
}
