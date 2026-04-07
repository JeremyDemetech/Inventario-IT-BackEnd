import * as sql from 'mssql';
import { getPool } from '../db/sqlserver/connection';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class SqlUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(
        `SELECT CodUser, Username, Name, email, Password, status, History, UserGroup, ConectedStatus, Location, Imagen, initial, IdDept, Skin, ImageUser
         FROM dbo.[User]
         WHERE CodUser = @id`
      );

    const row = result.recordset[0];
    if (!row) return null;
    return new User(
      row.CodUser,
      row.Username,
      row.Name,
      row.email,
      row.Password,
      row.status,
      row.History ?? null,
      row.UserGroup ?? null,
      row.ConectedStatus ?? 0,
      row.Location ?? null,
      row.Imagen ?? null,
      row.initial ?? null,
      row.IdDept ?? null,
      row.Skin ?? null,
      row.ImageUser ?? null
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('username', sql.VarChar(255), username)
      .query(
        `SELECT CodUser, Username, Name, email, Password, status, History, UserGroup, ConectedStatus, Location, Imagen, initial, IdDept, Skin, ImageUser
         FROM dbo.[User]
         WHERE Username = @username`
      );

    const row = result.recordset[0];
    if (!row) return null;
    return new User(
      row.CodUser,
      row.Username,
      row.Name,
      row.email,
      row.Password,
      row.status,
      row.History ?? null,
      row.UserGroup ?? null,
      row.ConectedStatus ?? 0,
      row.Location ?? null,
      row.Imagen ?? null,
      row.initial ?? null,
      row.IdDept ?? null,
      row.Skin ?? null,
      row.ImageUser ?? null
    );
  }
}
    