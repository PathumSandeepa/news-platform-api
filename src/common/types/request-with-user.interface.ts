import { Role } from '@prisma/client';

export interface RequestWithUser {
  user: {
    id: string;
    role: Role;
    email?: string;
    username?: string;
  };
}
