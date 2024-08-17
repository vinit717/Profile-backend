import { Request, Response, NextFunction } from 'express';
import { decryptToken, verifyToken } from '../utils/jwt';


interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export default function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const encryptedToken = req.cookies.token;

  if (!encryptedToken) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const token = decryptToken(encryptedToken, process.env.JWT_ENCRYPTION_KEY!);
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}
