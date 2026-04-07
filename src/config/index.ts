import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DB_CONNECTION_STRING || '';

export const db = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 1433),
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  connectionString,
};
