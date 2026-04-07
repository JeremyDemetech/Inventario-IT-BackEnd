import { Request, Response } from 'express';
import { SqlAssetSpecsRepository } from '../../infrastructure/repositories/SqlAssetSpecsRepository';

export class AssetSpecsController {
  private repo = new SqlAssetSpecsRepository();

  /**
   * @swagger
   * /assets/{id}/specs:
   *   post:
   *     summary: Crear especificaciones técnicas para un Asset (computadora)
   *     tags:
   *       - AssetSpecs
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: []
   *             properties:
   *               HardDrive:
   *                 type: string
   *               RAM:
   *                 type: string
   *               Processor:
   *                 type: string
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: ID inválido
   */
  async create(req: Request, res: Response) {
    const assetId = Number(req.params.id);
    const { HardDrive, RAM, Processor } = req.body;
    if (Number.isNaN(assetId)) return res.status(400).json({ error: 'ID inválido' });
    try {
      // If already exists, respond conflict
      const existing = await this.repo.findById(assetId);
      if (existing) return res.status(409).json({ error: 'Specs already exist for this asset' });

      await this.repo.create(assetId, HardDrive ?? null, RAM ?? null, Processor ?? null);
      res.status(201).json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /assets/{id}/specs:
   *   put:
   *     summary: Actualizar especificaciones técnicas de un Asset
   *     tags:
   *       - AssetSpecs
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               HardDrive:
   *                 type: string
   *               RAM:
   *                 type: string
   *               Processor:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: ID inválido
   */
  async update(req: Request, res: Response) {
    const assetId = Number(req.params.id);
    const { HardDrive, RAM, Processor } = req.body;
    if (Number.isNaN(assetId)) return res.status(400).json({ error: 'ID inválido' });
    try {
      const existing = await this.repo.findById(assetId);
      if (!existing) return res.status(404).json({ error: 'Specs not found' });

      await this.repo.update(assetId, HardDrive ?? null, RAM ?? null, Processor ?? null);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }
}
