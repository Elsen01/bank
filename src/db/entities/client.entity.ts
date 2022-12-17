import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'text' })
  document: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;
}
