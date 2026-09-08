import { User } from '#common/infrastructure/database/generated/prisma/client.js';

export abstract class UserServiceContract {
  abstract userGetById(id: number): Promise<User | null>;
}
