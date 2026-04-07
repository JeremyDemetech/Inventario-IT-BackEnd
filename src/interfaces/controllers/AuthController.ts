import { Request, Response } from 'express';
import { SqlUserRepository } from '../../infrastructure/repositories/SqlUserRepository';
import { LoginUseCase } from '../../usecases/LoginUseCase';
import { signToken } from '../../utils/jwt';

export class AuthController {
  private useCase: LoginUseCase;

  constructor() {
    const repo = new SqlUserRepository();
    this.useCase = new LoginUseCase(repo);
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login de usuario
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: admin
   *               password:
   *                 type: string
   *                 example: 123456
   *     responses:
   *       200:
   *         description: Login exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                 user:
   *                   type: object
   *                   properties:
   *                     CodUser:
   *                       type: integer
   *                     Username:
   *                       type: string
   *                     Name:
   *                       type: string
   *                     email:
   *                       type: string
   *                     UserGroup:
   *                       type: string
   *       400:
   *         description: username y password requeridos
   *       401:
   *         description: Credenciales inválidas
   *       500:
   *         description: Error interno
   */
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }

    try {
      const user = await this.useCase.execute(username, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const payload = {
        CodUser: user.CodUser,
        Username: user.Username,
        UserGroup: user.UserGroup
      };

      const token = signToken(payload);

      return res.json({
        token,
        user: {
          CodUser: user.CodUser,
          Username: user.Username,
          Name: user.Name,
          email: user.email,
          UserGroup: user.UserGroup
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  }
}
