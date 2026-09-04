const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vases.org' },
    update: {},
    create: {
      email: 'admin@vases.org',
      name: 'Admin Principal',
      password: 'admin', // En production, il faut hasher ce mot de passe !
      role: 'ADMIN'
    }
  });
  console.log('Admin créé:', admin);
}

main().catch(console.error).finally(() => prisma.$disconnect());
