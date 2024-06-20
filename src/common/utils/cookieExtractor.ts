import { Request } from 'express';

export const cookieExtractor = (req: Request): string | null => {
  const token = req.cookies['refresh-jwt'] || null;

  return token;
};
