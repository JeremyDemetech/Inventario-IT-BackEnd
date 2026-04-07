import * as sql from 'mssql';
import { getPool } from '../db/sqlserver/connection';
import { Asset } from '../../domain/entities/Asset';

export class SqlAssetRepository {
  async findById(id: number): Promise<Asset | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT AssetId, ElementTypeId, BrandId, Model, Serial, Year, Code, Status, [Condition], Notes, Active, CreatedAt FROM dbo.Asset WHERE AssetId = @id');

    const row = result.recordset[0];
    if (!row) return null;
    return new Asset(row.AssetId, row.ElementTypeId, row.BrandId, row.Model ?? null, row.Serial ?? null, row.Year ?? null, row.Code ?? null, row.Status, row.Condition ?? null, row.Notes ?? null, !!row.Active, new Date(row.CreatedAt));
  }

  async findAll(): Promise<Asset[]> {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT AssetId, ElementTypeId, BrandId, Model, Serial, Year, Code, Status, [Condition], Notes, Active, CreatedAt FROM dbo.Asset');

    return result.recordset.map((r: any) => new Asset(r.AssetId, r.ElementTypeId, r.BrandId, r.Model ?? null, r.Serial ?? null, r.Year ?? null, r.Code ?? null, r.Status, r.Condition ?? null, r.Notes ?? null, !!r.Active, new Date(r.CreatedAt)));
  }

  async create(elementTypeId: number, brandId: number, model: string | null, serial: string | null, year: number | null, code: string | null, status: string, condition: string | null, notes: string | null): Promise<number> {
    const pool = await getPool();
    const result = await pool.request()
      .input('etid', sql.Int, elementTypeId)
      .input('brandid', sql.Int, brandId)
      .input('model', sql.VarChar(100), model)
      .input('serial', sql.VarChar(100), serial)
      .input('year', sql.Int, year)
      .input('code', sql.VarChar(50), code)
      .input('status', sql.VarChar(20), status)
      .input('cond', sql.VarChar(20), condition)
      .input('notes', sql.Text, notes)
      .query(`INSERT INTO dbo.Asset (ElementTypeId, BrandId, Model, Serial, Year, Code, Status, [Condition], Notes)
               OUTPUT INSERTED.AssetId
               VALUES (@etid, @brandid, @model, @serial, @year, @code, @status, @cond, @notes)`);

    return result.recordset[0].AssetId;
  }

  async update(id: number, elementTypeId: number, brandId: number, model: string | null, serial: string | null, year: number | null, code: string | null, status: string, condition: string | null, notes: string | null): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('etid', sql.Int, elementTypeId)
      .input('brandid', sql.Int, brandId)
      .input('model', sql.VarChar(100), model)
      .input('serial', sql.VarChar(100), serial)
      .input('year', sql.Int, year)
      .input('code', sql.VarChar(50), code)
      .input('status', sql.VarChar(20), status)
      .input('cond', sql.VarChar(20), condition)
      .input('notes', sql.Text, notes)
      .query(`UPDATE dbo.Asset SET ElementTypeId=@etid, BrandId=@brandid, Model=@model, Serial=@serial, Year=@year, Code=@code, Status=@status, [Condition]=@cond, Notes=@notes WHERE AssetId = @id`);
  }

  async setActive(id: number, active: boolean): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('active', sql.Bit, active)
      .query('UPDATE dbo.Asset SET Active = @active WHERE AssetId = @id');
  }

  async setStatus(id: number, status: string): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.VarChar(20), status)
      .query('UPDATE dbo.Asset SET Status = @status WHERE AssetId = @id');
  }
}
