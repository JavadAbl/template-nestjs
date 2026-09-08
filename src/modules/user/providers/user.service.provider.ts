import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository.js';
import { UserServiceContract } from '../contracts/user-service.contract.js';
import { User } from '#common/infrastructure/database/generated/prisma/client.js';

@Injectable()
export class UserProvider implements UserServiceContract {
  constructor(private readonly userRep: UserRepository) {}

  userGetById(id: number): Promise<User | null> {
    return this.userRep.findUnique({ where: { id } });
  }
}
