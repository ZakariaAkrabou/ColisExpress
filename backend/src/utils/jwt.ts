import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '1d';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'your_sercet_fallback_key';


const getSecret = (): jwt.Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in environment');
  return secret;
};

export const generateToken = (userId: string, role: string, tokenVersion: number): string => {
  return jwt.sign({ id: userId, role, tokenVersion }, JWT_SECRET as jwt.Secret, { expiresIn: '1d' });
};

export const verifyToken = (token: string): { id: string; role: string } => {
  return jwt.verify(token, getSecret()) as { id: string; role: string };
};
