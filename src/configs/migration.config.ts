import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

const opt: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_SCHEMA,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../db/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/../db/migrations/*.{ts,js}'],
  logging: true,
};

export const dataSource = new DataSource(opt);
