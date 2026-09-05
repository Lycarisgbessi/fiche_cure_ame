import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const DB_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_TBohfK4nPcq6@ep-autumn-moon-aybk33iq-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = new PrismaClient({ datasourceUrl: DB_URL });

  try {
    if (req.method === 'GET') {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      });
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const { name, email, password, role } = req.body;
      const existing = await prisma.user.findFirst({ where: { name } });
      if (existing) {
        return res.status(400).json({ message: 'Ce nom existe déjà.' });
      }
      const user = await prisma.user.create({
        data: {
          name,
          email: email || `${name.replace(/\s+/g, '').toLowerCase()}@vases.org`,
          password,
          role: role || 'PASTOR'
        }
      });
      return res.status(201).json(user);
    }

    if (req.method === 'PUT') {
      const { id, smtpHost, smtpPort, smtpUser, smtpPass } = req.body;
      const user = await prisma.user.update({
        where: { id },
        data: {
          smtpHost,
          smtpPort: smtpPort ? parseInt(smtpPort) : null,
          smtpUser,
          smtpPass
        }
      });
      return res.status(200).json(user);
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', detail: error?.message });
  } finally {
    await prisma.$disconnect();
  }
}
