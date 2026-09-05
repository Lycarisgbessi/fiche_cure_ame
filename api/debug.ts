import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Test 1: Check env var
    const dbUrl = process.env.DATABASE_URL;
    const hasDbUrl = !!dbUrl;
    const dbUrlPreview = dbUrl ? dbUrl.substring(0, 40) + '...' : 'NOT SET';

    // Test 2: Try to import Prisma
    let prismaOk = false;
    let prismaError = '';
    try {
      const { PrismaClient } = await import('@prisma/client');
      const p = new PrismaClient({
        datasources: { db: { url: dbUrl || "postgresql://neondb_owner:npg_TBohfK4nPcq6@ep-autumn-moon-aybk33iq-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require" } }
      });
      await p.$connect();
      const count = await p.user.count();
      await p.$disconnect();
      prismaOk = true;
      return res.status(200).json({
        hasDbUrl,
        dbUrlPreview,
        prismaOk,
        userCount: count,
        nodeVersion: process.version,
        platform: process.platform
      });
    } catch (e: any) {
      prismaError = e.message;
    }

    return res.status(200).json({
      hasDbUrl,
      dbUrlPreview,
      prismaOk,
      prismaError,
      nodeVersion: process.version,
      platform: process.platform
    });
  } catch (e: any) {
    return res.status(500).json({ fatal: e.message });
  }
}
