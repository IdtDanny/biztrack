import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const roles = [
    { name: 'Owner', permissions: ['*'] },
    { name: 'Admin', permissions: ['users:manage', 'users:view', 'products:*', 'sales:*', 'reports:view'] },
    { name: 'Manager', permissions: ['products:*', 'sales:*', 'inventory:view', 'customers:view'] },
    { name: 'Cashier', permissions: ['sales:create', 'sales:view', 'customers:view', 'payments:create'] },
    { name: 'Viewer', permissions: ['reports:view', 'products:view', 'sales:view'] },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // Seed default roles
//   const roles = [
//     { name: 'Owner', permissions: ['*'] },
//     { name: 'Admin', permissions: ['users:manage', 'products:*', 'sales:*', 'reports:view'] },
//     { name: 'Manager', permissions: ['products:*', 'sales:*', 'inventory:view', 'customers:view'] },
//     { name: 'Cashier', permissions: ['sales:create', 'sales:view', 'customers:view', 'payments:create'] },
//     { name: 'Viewer', permissions: ['reports:view', 'products:view', 'sales:view'] },
//   ];

//   for (const role of roles) {
//     await prisma.role.upsert({
//       where: { name: role.name },
//       update: {},
//       create: role,
//     });
//   }

//   console.log('Seed completed');
// }

// main()
//   .catch(e => console.error(e))
//   .finally(async () => await prisma.$disconnect());