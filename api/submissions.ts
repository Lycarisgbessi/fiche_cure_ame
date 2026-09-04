import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from './_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const submissions = await prisma.submission.findMany({
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

  return res.status(405).json({ message: 'Method not allowed' });
}
