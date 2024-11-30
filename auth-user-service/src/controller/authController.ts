import { Request, Response } from 'express';
import { User, IUser } from '../models/userModel';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/errorHandler';
import { RequestWithUser } from '../middleware/authMiddleware';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }
  return jwt.sign({ id }, secret, { expiresIn: '15m' });
};


export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'Username or email already exists' });
      return;
    }

    const newUser: IUser = await User.create({
      username,
      email,
      password,
    });

    const token = generateToken(newUser._id as string);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ message: 'User not found. Please sign up.' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Incorrect password. Please try again.' });
      return;
    }

    const token = generateToken(user._id as string);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getMe = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const verifyToken = (req: Request, res: Response): void => {
  const { token } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET as string;
  if (!JWT_SECRET) {
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
  }
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.status(200).json({ success: true, user: decoded });
  } catch (error) {
      res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};