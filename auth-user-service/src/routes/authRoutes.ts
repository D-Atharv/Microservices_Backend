import express from 'express';
import { getMe, login, signup, verifyToken } from '../controller/authController';
import { validateUser } from '../middleware/validationMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router
  .get('/me', protect, getMe)
  .post('/signup', signup)
  .post('/login', validateUser, login)
  .post('/verify', verifyToken);


export default router;
