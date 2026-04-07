import { Request, Response } from 'express';
import { SqlAssetRepository } from '../../infrastructure/repositories/SqlAssetRepository';

export class AssetController {
  private repo = new SqlAssetRepository();

  /**
   * @swagger
   * /assets:
   *   get:
   *     summary: Obtener todos los Assets
   *     tags:
   *       - Assets
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
  async getAll(req: Request, res: Response) {
    try {
      const items = await this.repo.findAll();
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /assets/{id}:
   *   get:
   *     summary: Obtener un Asset por id
   *     tags:
   *       - Assets
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: ID inválido
   *       404:
   *         description: No encontrado
   */
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    try {
      const item = await this.repo.findById(id);
      if (!item) return res.status(404).json({ error: 'No encontrado' });
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /assets:
   *   post:
   *     summary: Crear un nuevo Asset
   *     tags:
   *       - Assets
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [ElementTypeId, BrandId, Status]
   *             properties:
   *               ElementTypeId:
   *                 type: integer
   *               BrandId:
   *                 type: integer
   *               Model:
   *                 type: string
   *               Serial:
   *                 type: string
   *               Year:
   *                 type: integer
   *               Code:
   *                 type: string
   *               Status:
   *                 type: string
   *               Condition:
   *                 type: string
   *               Notes:
   *                 type: string
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: Campos requeridos
   */
  async create(req: Request, res: Response) {
    const { ElementTypeId, BrandId, Model, Serial, Year, Code, Status, Condition, Notes } = req.body;
    if (typeof ElementTypeId !== 'number' || typeof BrandId !== 'number' || !Status) return res.status(400).json({ error: 'Campos requeridos' });
    try {
      const id = await this.repo.create(ElementTypeId, BrandId, Model ?? null, Serial ?? null, Year ?? null, Code ?? null, Status, Condition ?? null, Notes ?? null);
      res.status(201).json({ AssetId: id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /assets/{id}:
   *   put:
   *     summary: Actualizar un Asset
   *     tags:
   *       - Assets
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
   *             required: [ElementTypeId, BrandId, Status]
   *             properties:
   *               ElementTypeId:
   *                 type: integer
   *               BrandId:
   *                 type: integer
   *               Model:
   *                 type: string
   *               Serial:
   *                 type: string
   *               Year:
   *                 type: integer
   *               Code:
   *                 type: string
   *               Status:
   *                 type: string
   *               Condition:
   *                 type: string
   *               Notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: ID o campos inválidos
   */
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { ElementTypeId, BrandId, Model, Serial, Year, Code, Status, Condition, Notes } = req.body;
    if (Number.isNaN(id) || typeof ElementTypeId !== 'number' || typeof BrandId !== 'number' || !Status) return res.status(400).json({ error: 'ID o campos inválidos' });
    try {
      await this.repo.update(id, ElementTypeId, BrandId, Model ?? null, Serial ?? null, Year ?? null, Code ?? null, Status, Condition ?? null, Notes ?? null);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /assets/{id}/active:
   *   patch:
   *     summary: Activar/desactivar un Asset
   *     tags:
   *       - Assets
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
   *             required: [active]
   *             properties:
   *               active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: ID o estado inválido
   */
  async setActive(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { active } = req.body;
    if (Number.isNaN(id) || typeof active !== 'boolean') return res.status(400).json({ error: 'ID o estado inválido' });
    try {
      await this.repo.setActive(id, active);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /assets/{id}/status:
   *   patch:
   *     summary: Cambiar el estado de un Asset
   *     tags:
   *       - Assets
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
   *             required: [status]
   *             properties:
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: ID o estado inválido
   */
  async setStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (Number.isNaN(id) || typeof status !== 'string') return res.status(400).json({ error: 'ID o estado inválido' });
    try {
      await this.repo.setStatus(id, status);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }
}
