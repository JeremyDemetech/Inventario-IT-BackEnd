import dotenv from 'dotenv';
import * as sql from 'mssql';
import { db } from '../../../config';

dotenv.config();

// Support host with instance name, e.g. "localhost\\SQLEXPRESS"
const hostValue = db.host || 'localhost';
let serverName = hostValue;
let instanceName: string | undefined;
if (hostValue.includes('\\')) {
  const parts = hostValue.split('\\');
  serverName = parts[0];
  instanceName = parts[1];
}

const config: sql.config = {
  user: db.user,
  password: db.password,
  server: serverName,
  database: db.database,
  // If instance name provided, the driver will use instanceName option instead of port
  port: instanceName ? undefined : db.port,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    ...(instanceName ? { instanceName } : {})
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
};

let pool: sql.ConnectionPool | null = null;

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (pool) {
    try {
      if (pool.connected) return pool;
    } catch (err) {
      pool = null;
    }
  }

  // Si se provee una connection string, úsala; si no, usa el config.
  if (db.connectionString && db.connectionString.length > 0) {
    pool = new sql.ConnectionPool(db.connectionString);
  } else {
    pool = new sql.ConnectionPool(config);
  }

  try {
    await pool.connect();
    return pool;
  } catch (err) {
    const target = db.connectionString && db.connectionString.length > 0
      ? 'connection string'
      : `${serverName}${instanceName ? `\\${instanceName}` : `:${db.port}`}`;
    console.error(`Failed to connect to SQL Server (${target}).`);
    throw err;
  }
};
