import * as sql from 'mssql';
import { getPool } from '../db/sqlserver/connection';

export class SqlReportRepository {
  async getInventory(): Promise<any[]> {
    const pool = await getPool();
    const result = await pool.request()
      .query(`
        SELECT dep.Name AS DepartmentName,
               dep.Abbreviation,
               per.FullName,
               per.Position,
               assetAssig.AssignedDate,
               elem.Name AS ElementTypeName,
               bran.Name AS BrandName,
               Asset.Model,
               Asset.Serial,
               Asset.Year,
               Asset.Code,
               Asset.Status,
               Asset.Condition,
               Asset.Notes,
               Asset.CreatedAt,
               assetSp.HardDrive,
               assetSp.RAM,
               assetSp.Processor
        FROM dbo.Department dep
          INNER JOIN dbo.Person per
            ON dep.DepartmentId = per.DepartmentId
          INNER JOIN dbo.AssetAssignment assetAssig
            ON per.PersonId = assetAssig.PersonId
          INNER JOIN dbo.Asset Asset
            ON assetAssig.AssetId = Asset.AssetId
          INNER JOIN dbo.ElementType elem
            ON elem.ElementTypeId = Asset.ElementTypeId
          INNER JOIN dbo.Brand bran
            ON bran.BrandId = Asset.BrandId
          LEFT JOIN dbo.AssetSpecs assetSp
            ON Asset.AssetId = assetSp.AssetId
      `);

    return result.recordset;
  }
}
