import { Request, Response } from 'express';
import { SqlUserRepository } from '../../infrastructure/repositories/SqlUserRepository';
import { GetUserByIdUseCase } from '../../usecases/GetUserByIdUseCase';

export class UserController {
  private useCase: GetUserByIdUseCase;

  constructor() {
    const repo = new SqlUserRepository();
    this.useCase = new GetUserByIdUseCase(repo);
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get user by id
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric id of the user to get
   *     responses:
   *       200:
   *         description: User object without password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 CodUser:
   *                   type: integer
   *                 Username:
   *                   type: string
   *                 Name:
   *                   type: string
   *                 email:
   *                   type: string
   *                 status:
   *                   type: integer
   *                 History:
   *                   type: string
   *                 UserGroup:
   *                   type: string
   *                 ConectedStatus:
   *                   type: integer
   *                 Location:
   *                   type: string
   *                 Imagen:
   *                   type: string
   *                 initial:
   *                   type: string
   *                 IdDept:
   *                   type: integer
   *                 Skin:
   *                   type: string
   *                 ImageUser:
   *                   type: string
   *       400:
   *         description: Invalid id supplied
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      const user = await this.useCase.execute(id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      // No devolver la contraseña en la respuesta
      const { Password, ...safe } = user as any;
      return res.json(safe);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  }
}
