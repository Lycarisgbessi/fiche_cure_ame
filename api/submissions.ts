import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
const DB_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_TBohfK4nPcq6@ep-autumn-moon-aybk33iq-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';
const prisma = new PrismaClient({ datasourceUrl: DB_URL });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { role, userId } = req.query;
    try {
      let whereClause = {};
      if (role === 'PASTOR' && userId) {
        whereClause = { interviewerId: String(userId) };
      }

      const submissions = await prisma.submission.findMany({
        where: whereClause,
        include: { interviewer: true },
        orderBy: { date: 'desc' }
      });

      // Format for the frontend
      const formatted = submissions.map(s => ({
        ...s,
        interviewerName: s.interviewer?.name || null,
      }));

      return res.status(200).json(formatted);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching submissions' });
    }
  }

  if (req.method === 'POST') {
    const { faithfulName, answers } = req.body;
    try {
      const submission = await prisma.submission.create({
        data: {
          faithfulName,
          answers,
          comments: {}
        }
      });
      return res.status(201).json(submission);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating submission' });
    }
  }

  if (req.method === 'PUT') {
    const { id, status, globalObservations, comments, interviewerName } = req.body;
    try {
      let interviewerId = undefined;
      if (interviewerName) {
        const pastor = await prisma.user.findFirst({ where: { name: interviewerName } });
        if (pastor) interviewerId = pastor.id;
      }

      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (globalObservations !== undefined) updateData.globalObservations = globalObservations;
      if (comments !== undefined) updateData.comments = comments;
      if (interviewerId !== undefined) updateData.interviewerId = interviewerId;

      const submission = await prisma.submission.update({
        where: { id: String(id) },
        data: updateData
      });

      return res.status(200).json(submission);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating submission' });
    }
  }

  
  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await prisma.submission.delete({
        where: { id: String(id) }
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting submission' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

