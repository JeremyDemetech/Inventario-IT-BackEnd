import { Request, Response } from 'express';
import { SqlReportRepository } from '../../infrastructure/repositories/SqlReportRepository';

export class ReportController {
  private repo = new SqlReportRepository();

  /**
   * @swagger
   * /reports/inventory:
   *   get:
   *     summary: Obtener reporte de inventario completo
   *     tags:
   *       - Reports
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   */
  async getInventory(req: Request, res: Response) {
    try {
      const data = await this.repo.getInventory();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }
}
