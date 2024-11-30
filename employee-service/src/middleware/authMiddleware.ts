import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL as string;
const AUTH_SERVICE_URL = 'http://localhost:5000';

interface JwtPayload {
  id: string;
}

export interface RequestWithUser extends Request {
  user?: any;
}


export const protect = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {

    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const decoded = data.user;
      req.user = decoded;
      return next();
    }

    else {
      res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
