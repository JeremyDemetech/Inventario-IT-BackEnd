import { Request, Response } from 'express';
import { SqlBrandRepository } from '../../infrastructure/repositories/SqlBrandRepository';

export class BrandController {
  private repo = new SqlBrandRepository();

  /**
   * @swagger
   * /brands:
   *   get:
   *     summary: Obtener todas las Brands
   *     tags:
   *       - Brands
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
   * /brands/{id}:
   *   get:
   *     summary: Obtener una Brand por id
   *     tags:
   *       - Brands
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
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
   * /brands:
   *   post:
   *     summary: Crear una nueva Brand
   *     tags:
   *       - Brands
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [Name, Abbreviation]
   *             properties:
   *               Name:
   *                 type: string
   *               Abbreviation:
   *                 type: string
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: Campos requeridos
   */
  async create(req: Request, res: Response) {
    const { Name, Abbreviation } = req.body;
    if (!Name || !Abbreviation) return res.status(400).json({ error: 'Campos requeridos' });
    try {
      const id = await this.repo.create(Name, Abbreviation);
      res.status(201).json({ BrandId: id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /brands/{id}:
   *   put:
   *     summary: Actualizar una Brand
   *     tags:
   *       - Brands
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
   *             required: [Name, Abbreviation]
   *             properties:
   *               Name:
   *                 type: string
   *               Abbreviation:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: ID o campos inválidos
   */
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { Name, Abbreviation } = req.body;
    if (Number.isNaN(id) || !Name || !Abbreviation) return res.status(400).json({ error: 'ID o campos inválidos' });
    try {
      await this.repo.update(id, Name, Abbreviation);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /brands/{id}/active:
   *   patch:
   *     summary: Activar/desactivar una Brand
   *     tags:
   *       - Brands
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
}
