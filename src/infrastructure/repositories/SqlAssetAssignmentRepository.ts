import * as sql from 'mssql';
import { getPool } from '../db/sqlserver/connection';
import { AssetAssignment } from '../../domain/entities/AssetAssignment';

export class SqlAssetAssignmentRepository {
  async findById(id: number): Promise<AssetAssignment | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT AssignmentId, AssetId, PersonId, DepartmentId, AssignedDate, ReturnDate, Notes FROM dbo.AssetAssignment WHERE AssignmentId = @id');

    const row = result.recordset[0];
    if (!row) return null;
    return new AssetAssignment(row.AssignmentId, row.AssetId, row.PersonId, row.DepartmentId, row.AssignedDate, row.ReturnDate ?? null, row.Notes ?? null);
  }

  async findAll(): Promise<AssetAssignment[]> {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT AssignmentId, AssetId, PersonId, DepartmentId, AssignedDate, ReturnDate, Notes FROM dbo.AssetAssignment');

    return result.recordset.map((r: any) => new AssetAssignment(r.AssignmentId, r.AssetId, r.PersonId, r.DepartmentId, r.AssignedDate, r.ReturnDate ?? null, r.Notes ?? null));
  }

  async create(assetId: number, personId: number, departmentId: number, assignedDate: string, returnDate: string | null, notes: string | null): Promise<number> {
    const pool = await getPool();
    const result = await pool.request()
      .input('assetId', sql.Int, assetId)
      .input('personId', sql.Int, personId)
      .input('departmentId', sql.Int, departmentId)
      .input('assignedDate', sql.Date, assignedDate)
      .input('returnDate', sql.Date, returnDate)
      .input('notes', sql.Text, notes)
      .query(`INSERT INTO dbo.AssetAssignment (AssetId, PersonId, DepartmentId, AssignedDate, ReturnDate, Notes)
               OUTPUT INSERTED.AssignmentId
               VALUES (@assetId, @personId, @departmentId, @assignedDate, @returnDate, @notes)`);

    return result.recordset[0].AssignmentId;
  }

  async update(id: number, personId: number, departmentId: number, assignedDate: string, returnDate: string | null, notes: string | null): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('personId', sql.Int, personId)
      .input('departmentId', sql.Int, departmentId)
      .input('assignedDate', sql.Date, assignedDate)
      .input('returnDate', sql.Date, returnDate)
      .input('notes', sql.Text, notes)
      .query(`UPDATE dbo.AssetAssignment SET PersonId=@personId, DepartmentId=@departmentId, AssignedDate=@assignedDate, ReturnDate=@returnDate, Notes=@notes WHERE AssignmentId = @id`);
  }

  async setReturnDate(id: number, returnDate: string): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('returnDate', sql.Date, returnDate)
      .query('UPDATE dbo.AssetAssignment SET ReturnDate = @returnDate WHERE AssignmentId = @id');
  }
}
