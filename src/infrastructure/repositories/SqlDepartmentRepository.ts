import * as sql from 'mssql';
import { getPool } from '../db/sqlserver/connection';
import { Department } from '../../domain/entities/Department';

export class SqlDepartmentRepository {
  async findById(id: number): Promise<Department | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT DepartmentId, Name, Abbreviation, Active FROM dbo.Department WHERE DepartmentId = @id');

    const row = result.recordset[0];
    if (!row) return null;
    return new Department(row.DepartmentId, row.Name, row.Abbreviation, !!row.Active);
  }

  async findAll(): Promise<Department[]> {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT DepartmentId, Name, Abbreviation, Active FROM dbo.Department');

    return result.recordset.map((r: any) => new Department(r.DepartmentId, r.Name, r.Abbreviation, !!r.Active));
  }

  async create(name: string, abbreviation: string): Promise<number> {
    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.VarChar(100), name)
      .input('abbr', sql.VarChar(10), abbreviation)
      .query('INSERT INTO dbo.Department (Name, Abbreviation) OUTPUT INSERTED.DepartmentId VALUES (@name, @abbr)');

    return result.recordset[0].DepartmentId;
  }

  async update(id: number, name: string, abbreviation: string): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar(100), name)
      .input('abbr', sql.VarChar(10), abbreviation)
      .query('UPDATE dbo.Department SET Name = @name, Abbreviation = @abbr WHERE DepartmentId = @id');
  }

  async setActive(id: number, active: boolean): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('active', sql.Bit, active)
      .query('UPDATE dbo.Department SET Active = @active WHERE DepartmentId = @id');
  }
}
