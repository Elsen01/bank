import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ name: 'daily_withdrawal_limit', type: 'float', default: 1000 })
  dailyWithdrawalLimit: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'account_type', type: 'int' })
  accountType: number;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @OneToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  client: Client;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
