import * as sql from 'mssql';
import { getPool } from '../db/sqlserver/connection';
import { Person } from '../../domain/entities/Person';

export class SqlPersonRepository {
  async findById(id: number): Promise<Person | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT PersonId, FullName, DepartmentId, Position, Email, [Description], Active, CreatedAt FROM dbo.Person WHERE PersonId = @id');

    const row = result.recordset[0];
    if (!row) return null;
    return new Person(row.PersonId, row.FullName, row.DepartmentId, row.Position ?? null, row.Email ?? null, row.Description ?? null, !!row.Active, new Date(row.CreatedAt));
  }

  async findAll(): Promise<Person[]> {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT PersonId, FullName, DepartmentId, Position, Email, [Description], Active, CreatedAt FROM dbo.Person');

    return result.recordset.map((r: any) => new Person(r.PersonId, r.FullName, r.DepartmentId, r.Position ?? null, r.Email ?? null, r.Description ?? null, !!r.Active, new Date(r.CreatedAt)));
  }

  async create(fullName: string, departmentId: number, position: string | null, email: string | null, description: string | null): Promise<number> {
    const pool = await getPool();
    const result = await pool.request()
      .input('fullName', sql.VarChar(150), fullName)
      .input('dept', sql.Int, departmentId)
      .input('position', sql.VarChar(100), position)
      .input('email', sql.VarChar(100), email)
      .input('description', sql.VarChar(500), description)
      .query(`INSERT INTO dbo.Person (FullName, DepartmentId, Position, Email, [Description]) OUTPUT INSERTED.PersonId VALUES (@fullName, @dept, @position, @email, @description)`);

    return result.recordset[0].PersonId;
  }

  async update(id: number, fullName: string, departmentId: number, position: string | null, email: string | null, description: string | null): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('fullName', sql.VarChar(150), fullName)
      .input('dept', sql.Int, departmentId)
      .input('position', sql.VarChar(100), position)
      .input('email', sql.VarChar(100), email)
      .input('description', sql.VarChar(500), description)
      .query('UPDATE dbo.Person SET FullName = @fullName, DepartmentId = @dept, Position = @position, Email = @email, [Description] = @description WHERE PersonId = @id');
  }

  async setActive(id: number, active: boolean): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('active', sql.Bit, active)
      .query('UPDATE dbo.Person SET Active = @active WHERE PersonId = @id');
  }
}
