import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from './_lib/prisma';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, recipientEmail, subject, text, filename, fileBase64, contentType } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (!user.smtpHost || !user.smtpUser || !user.smtpPass) {
      return res.status(400).json({ message: 'Veuillez configurer vos paramètres SMTP dans votre profil avant d\'envoyer un email.' });
    }

    // Creer le transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: user.smtpHost,
      port: user.smtpPort || 465,
      secure: user.smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: user.smtpUser,
        pass: user.smtpPass
      }
    });

    // Envoyer l'email
    const info = await transporter.sendMail({
      from: \`"\${user.name}" <\${user.smtpUser}>\`,
      to: recipientEmail,
      subject: subject,
      text: text,
      attachments: fileBase64 ? [
        {
          filename: filename,
          content: Buffer.from(fileBase64, 'base64'),
          contentType: contentType
        }
      ] : []
    });

    return res.status(200).json({ message: 'Email envoyé avec succès', messageId: info.messageId });
  } catch (error: any) {
    console.error('SMTP Error:', error);
    return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email: ' + (error.message || 'Erreur inconnue') });
  }
}
