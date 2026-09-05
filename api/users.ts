import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
const DB_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_TBohfK4nPcq6@ep-autumn-moon-aybk33iq-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';
const prisma = new PrismaClient({ datasourceUrl: DB_URL });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      });
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  }

  if (req.method === 'POST') {
    const { name, email, password, role } = req.body;
    try {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating user' });
    }
  }

  if (req.method === 'PUT') {
    const { id, smtpHost, smtpPort, smtpUser, smtpPass } = req.body;
    try {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
