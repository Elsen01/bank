import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  value: number;

  @CreateDateColumn({ name: 'transaction_date' })
  transactionDate: Date;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;
}
