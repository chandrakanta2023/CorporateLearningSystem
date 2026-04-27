import { config } from 'dotenv';

config();

export interface DbEnv {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export function getDbEnv(): DbEnv {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'corporate_learning_db',
  };
}
