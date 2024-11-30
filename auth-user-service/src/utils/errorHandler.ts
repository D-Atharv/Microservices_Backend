import { Response } from 'express';

export const errorHandler = (res: Response, error: unknown): void => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
};
