import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '1d';

// Read the secret at call time (not at import time) so it always reflects the loaded .env,
// and so signing and verifying are guaranteed to use the same key.
const getSecret = (): jwt.Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in environment');
  return secret;
};

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, getSecret(), { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { id: string; role: string } => {
  return jwt.verify(token, getSecret()) as { id: string; role: string };
};
