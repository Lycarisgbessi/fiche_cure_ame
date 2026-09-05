import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const DB_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_TBohfK4nPcq6@ep-autumn-moon-aybk33iq-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const prisma = new PrismaClient({ datasourceUrl: DB_URL });

  try {
    const { name, password } = req.body || {};

    if (!name) {
      return res.status(400).json({ message: 'Identifiant requis' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ name }, { email: name }]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', detail: error?.message });
  } finally {
    await prisma.$disconnect();
  }
}
