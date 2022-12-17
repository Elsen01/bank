import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
config();

export const typeormConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_SCHEMA,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: process.env.NODE_ENV === 'development',
  migrationsTableName: 'migrations',
  entities: [__dirname + '/../db/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/../db/migrations/*.{ts,js}'],
  migrationsRun: true,
  synchronize: false,
};
