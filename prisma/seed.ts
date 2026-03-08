import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedUsers } from './seeders/user.seeder';
import { seedArticles } from './seeders/article.seeder';

const DATABASE_URL =
   process.env.DATABASE_URL ||
   'postgresql://postgres:postgres@localhost:5432/newsplatform?schema=public';

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
   console.log(' Starting database seeding...\n');

   const users = await seedUsers(prisma);

   const adminUser = users.find((user) => user.role === 'ADMIN');
   if (!adminUser) {
      console.error(' Admin user not found. Cannot seed articles.');
      return;
   }

   await seedArticles(prisma, adminUser.id);

   console.log('\n  Seeding completed successfully!');
}

main()
   .catch((error) => {
      console.error('  Seeding failed:', error);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
      console.log('  Database connection closed.');
   });
