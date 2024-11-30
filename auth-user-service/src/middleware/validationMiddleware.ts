import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const userSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(8).required(),
});

export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    res.status(400).json({ errors: error.details.map((err) => err.message) });
    return;
  }
  next();
};
