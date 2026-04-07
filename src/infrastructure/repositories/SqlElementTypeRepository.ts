import * as sql from 'mssql';
import { getPool } from '../db/sqlserver/connection';
import { ElementType } from '../../domain/entities/ElementType';

export class SqlElementTypeRepository {
  async findById(id: number): Promise<ElementType | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT ElementTypeId, Name, Abbreviation, Active FROM dbo.ElementType WHERE ElementTypeId = @id');

    const row = result.recordset[0];
    if (!row) return null;
    return new ElementType(row.ElementTypeId, row.Name, row.Abbreviation, !!row.Active);
  }

  async findAll(): Promise<ElementType[]> {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT ElementTypeId, Name, Abbreviation, Active FROM dbo.ElementType');

    return result.recordset.map((r: any) => new ElementType(r.ElementTypeId, r.Name, r.Abbreviation, !!r.Active));
  }

  async create(name: string, abbreviation: string): Promise<number> {
    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.VarChar(100), name)
      .input('abbr', sql.VarChar(10), abbreviation)
      .query('INSERT INTO dbo.ElementType (Name, Abbreviation) OUTPUT INSERTED.ElementTypeId VALUES (@name, @abbr)');

    return result.recordset[0].ElementTypeId;
  }

  async update(id: number, name: string, abbreviation: string): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar(100), name)
      .input('abbr', sql.VarChar(10), abbreviation)
      .query('UPDATE dbo.ElementType SET Name = @name, Abbreviation = @abbr WHERE ElementTypeId = @id');
  }

  async setActive(id: number, active: boolean): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('active', sql.Bit, active)
      .query('UPDATE dbo.ElementType SET Active = @active WHERE ElementTypeId = @id');
  }
}
