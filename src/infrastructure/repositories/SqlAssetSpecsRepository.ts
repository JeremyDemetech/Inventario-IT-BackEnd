import * as sql from 'mssql';
import { getPool } from '../db/sqlserver/connection';
import { AssetSpecs } from '../../domain/entities/AssetSpecs';

export class SqlAssetSpecsRepository {
  async findById(assetId: number): Promise<AssetSpecs | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input('assetId', sql.Int, assetId)
      .query('SELECT AssetId, HardDrive, RAM, Processor FROM dbo.AssetSpecs WHERE AssetId = @assetId');

    const row = result.recordset[0];
    if (!row) return null;
    return new AssetSpecs(row.AssetId, row.HardDrive ?? null, row.RAM ?? null, row.Processor ?? null);
  }

  async create(assetId: number, hardDrive: string | null, ram: string | null, processor: string | null): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('assetId', sql.Int, assetId)
      .input('hardDrive', sql.VarChar(50), hardDrive)
      .input('ram', sql.VarChar(50), ram)
      .input('processor', sql.VarChar(100), processor)
      .query(`INSERT INTO dbo.AssetSpecs (AssetId, HardDrive, RAM, Processor) VALUES (@assetId, @hardDrive, @ram, @processor)`);
  }

  async update(assetId: number, hardDrive: string | null, ram: string | null, processor: string | null): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input('assetId', sql.Int, assetId)
      .input('hardDrive', sql.VarChar(50), hardDrive)
      .input('ram', sql.VarChar(50), ram)
      .input('processor', sql.VarChar(100), processor)
      .query(`UPDATE dbo.AssetSpecs SET HardDrive = @hardDrive, RAM = @ram, Processor = @processor WHERE AssetId = @assetId`);
  }
}
