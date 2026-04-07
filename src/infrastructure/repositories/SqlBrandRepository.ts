import * as sql from 'mssql';
import { getPool } from '../db/sqlserver/connection';
import { Brand } from '../../domain/entities/Brand';

export class SqlBrandRepository {
  async findById(id: number): Promise<Brand | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT BrandId, Name, Abbreviation, Active FROM dbo.Brand WHERE BrandId = @id');

    const row = result.recordset[0];
    if (!row) return null;
    return new Brand(row.BrandId, row.Name, row.Abbreviation, !!row.Active);
  }

  async findAll(): Promise<Brand[]> {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT BrandId, Name, Abbreviation, Active FROM dbo.Brand');

    return result.recordset.map((r: any) => new Brand(r.BrandId, r.Name, r.Abbreviation, !!r.Active));
  }

  async create(name: string, abbreviation: string): Promise<number> {
    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.VarChar(100), name)
      .input('abbr', sql.VarChar(10), abbreviation)
      .query('INSERT INTO dbo.Brand (Name, Abbreviation) OUTPUT INSERTED.BrandId VALUES (@name, @abbr)');

    return result.recordset[0].BrandId;
  }

  async update(id: number, name: string, abbreviation: string): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar(100), name)
      .input('abbr', sql.VarChar(10), abbreviation)
      .query('UPDATE dbo.Brand SET Name = @name, Abbreviation = @abbr WHERE BrandId = @id');
  }

  async setActive(id: number, active: boolean): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('active', sql.Bit, active)
      .query('UPDATE dbo.Brand SET Active = @active WHERE BrandId = @id');
  }
}
