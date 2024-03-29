import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { Language } from '../modules/languages/language.entity';

dotenv.config();

export const DB: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'flashcards',
  synchronize: false,
  logging: false,
  entities: [Language],
};

export const config = {
  DEV: {
    PORT: 8080,
    DB,
  },
};
