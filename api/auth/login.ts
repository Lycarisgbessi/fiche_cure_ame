import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { name },
          { email: name }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Pas de JWT complexe pour le prototype V1, on renvoie juste les infos de l'utilisateur.
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
