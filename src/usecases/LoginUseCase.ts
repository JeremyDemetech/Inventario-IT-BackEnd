import { IUserRepository } from '../domain/repositories/IUserRepository';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../domain/entities/User';

export class LoginUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(username: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) return null;

    // Primero: replicar EncodePassword VB = SHA1(Unicode(username+password)) -> Base64
    try {
      const combined = `${username}${password}`;
      const buf = Buffer.from(combined, 'utf16le'); // .NET UnicodeEncoding -> UTF-16LE
      const sha1 = crypto.createHash('sha1').update(buf).digest();
      const vbHash = sha1.toString('base64');

      if (vbHash === user.Password) return user;
    } catch (e) {
      // ignore and fallback
    }

    // Segundo: fallback a bcrypt (por si la contraseña está hasheada con bcrypt)
    try {
      const match = await bcrypt.compare(password, user.Password);
      if (match) return user;
    } catch (e) {
      // ignore
    }

    return null;
  }
}
