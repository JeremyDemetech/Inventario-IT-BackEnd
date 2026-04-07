import { Request, Response } from 'express';
import { SqlAssetAssignmentRepository } from '../../infrastructure/repositories/SqlAssetAssignmentRepository';
import { SqlAssetRepository } from '../../infrastructure/repositories/SqlAssetRepository';

export class AssetAssignmentController {
  private repo = new SqlAssetAssignmentRepository();
  private assetRepo = new SqlAssetRepository();

  /**
   * @swagger
   * /assignments:
   *   get:
   *     summary: Obtener todas las asignaciones
   *     tags:
   *       - AssetAssignment
   *     responses:
   *       200:
   *         description: OK
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
   * /assignments/{id}:
   *   get:
   *     summary: Obtener una asignación por id
   *     tags:
   *       - AssetAssignment
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
   * /assignments:
   *   post:
   *     summary: Crear una nueva asignación (asigna un Asset a una Person)
   *     tags:
   *       - AssetAssignment
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [AssetId, PersonId, DepartmentId, AssignedDate]
   */
  async create(req: Request, res: Response) {
    const { AssetId, PersonId, DepartmentId, AssignedDate, ReturnDate, Notes } = req.body;
    if (typeof AssetId !== 'number' || typeof PersonId !== 'number' || typeof DepartmentId !== 'number' || !AssignedDate) return res.status(400).json({ error: 'Campos requeridos' });
    try {
      // create assignment
      const id = await this.repo.create(AssetId, PersonId, DepartmentId, AssignedDate, ReturnDate ?? null, Notes ?? null);

      // update asset status to 'Asignado'
      await this.assetRepo.setStatus(AssetId, 'Asignado');

      res.status(201).json({ AssignmentId: id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /assignments/{id}:
   *   put:
   *     summary: Actualizar una asignación
   *     tags:
   *       - AssetAssignment
   */
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { PersonId, DepartmentId, AssignedDate, ReturnDate, Notes } = req.body;
    if (Number.isNaN(id) || typeof PersonId !== 'number' || typeof DepartmentId !== 'number' || !AssignedDate) return res.status(400).json({ error: 'ID o campos inválidos' });
    try {
      await this.repo.update(id, PersonId, DepartmentId, AssignedDate, ReturnDate ?? null, Notes ?? null);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  /**
   * @swagger
   * /assignments/{id}/return:
   *   patch:
   *     summary: Marcar la devolución de un asset (establece ReturnDate y pone Asset en 'Libre')
   *     tags:
   *       - AssetAssignment
   */
  async markReturn(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { ReturnDate } = req.body;
    if (Number.isNaN(id) || !ReturnDate) return res.status(400).json({ error: 'ID o fecha inválida' });
    try {
      const assignment = await this.repo.findById(id);
      if (!assignment) return res.status(404).json({ error: 'Asignación no encontrada' });

      await this.repo.setReturnDate(id, ReturnDate);
      // set asset status back to 'Libre'
      await this.assetRepo.setStatus(assignment.AssetId, 'Libre');

      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno' });
    }
  }
}
