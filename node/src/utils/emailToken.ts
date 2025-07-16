import jwt from 'jsonwebtoken';

export const createEmailToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.EMAIL_SECRET!, {
    expiresIn: '1d'
  });
};

export const verifyEmailToken = (token: string): { id: string } => {
  return jwt.verify(token, process.env.EMAIL_SECRET!) as { id: string };
};
