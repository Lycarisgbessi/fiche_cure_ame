import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Inject fallback URL if not provided by Vercel env vars
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://neondb_owner:npg_TBohfK4nPcq6@ep-autumn-moon-aybk33iq-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
