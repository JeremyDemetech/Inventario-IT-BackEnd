import { IUserRepository } from '../domain/repositories/IUserRepository';
import { User } from '../domain/entities/User';

export class GetUserByIdUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(id: number): Promise<User | null> {
    return this.userRepo.findById(id);
  }
}
