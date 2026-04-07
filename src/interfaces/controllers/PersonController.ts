import { Request, Response } from 'express';
import { SqlPersonRepository } from '../../infrastructure/repositories/SqlPersonRepository';

export class PersonController {
  private repo = new SqlPersonRepository();

  /**
   * @swagger
   * /persons:
   *   get:
   *     summary: Obtener todas las Persons
   *     tags:
   *       - Persons
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
   * /persons/{id}:
   *   get:
   *     summary: Obtener una Person por id
   *     tags:
   *       - Persons
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
   * /persons:
   *   post:
   *     summary: Crear una nueva Person
   *     tags:
   *       - Persons
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [FullName, DepartmentId]
   *             properties:
   *               FullName:
   *                 type: string
   *               DepartmentId:
   *                 type: integer
   *               Position:
   *                 type: string
   *               Email:
   *                 type: string
   *               Description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: Campos requeridos
   */
  async create(req: Request, res: Response) {
    const { FullName, DepartmentId, Position, Email, Description } = req.body;
    if (!FullName || typeof DepartmentId !== 'number') return res.status(400).json({ error: 'Campos requeridos' });
    try {
      const id = await this.repo.create(FullName, DepartmentId, Position ?? null, Email ?? null, Description ?? null);
      res.status(201).json({ PersonId: id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /persons/{id}:
   *   put:
   *     summary: Actualizar una Person
   *     tags:
   *       - Persons
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
   *             required: [FullName, DepartmentId]
   *             properties:
   *               FullName:
   *                 type: string
   *               DepartmentId:
   *                 type: integer
   *               Position:
   *                 type: string
   *               Email:
   *                 type: string
   *               Description:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: ID o campos inválidos
   */
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { FullName, DepartmentId, Position, Email, Description } = req.body;
    if (Number.isNaN(id) || !FullName || typeof DepartmentId !== 'number') return res.status(400).json({ error: 'ID o campos inválidos' });
    try {
      await this.repo.update(id, FullName, DepartmentId, Position ?? null, Email ?? null, Description ?? null);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /persons/{id}/active:
   *   patch:
   *     summary: Activar/desactivar una Person
   *     tags:
   *       - Persons
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
