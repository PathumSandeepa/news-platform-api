import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

interface SeededUser {
  id: string;
  username: string;
  email: string;
  role: Role;
}

const SALT_ROUNDS = 10;

const USERS_DATA = [
  {
    username: 'admin',
    email: 'admin@newsplatform.com',
    password: 'Admin@123',
    role: Role.ADMIN,
  },
  {
    username: 'editor',
    email: 'editor@newsplatform.com',
    password: 'Editor@123',
    role: Role.EDITOR,
  },
  {
    username: 'reader',
    email: 'reader@newsplatform.com',
    password: 'Reader@123',
    role: Role.READER,
  },
];

export async function seedUsers(prisma: PrismaClient): Promise<SeededUser[]> {
  console.log('\n Seeding users...');

  const seededUsers: SeededUser[] = [];

  for (const userData of USERS_DATA) {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      },
    });

    seededUsers.push({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    console.log(`User "${user.username}" (${user.role}) — ${user.email}`);
  }

  console.log(`Users seeding completed. Total: ${seededUsers.length}`);
  return seededUsers;
}
