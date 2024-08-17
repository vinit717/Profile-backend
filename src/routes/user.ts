import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { encryptToken, signToken } from '../utils/jwt';

const router = express.Router();

router.use(express.json());

router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password,
    });

    await newUser.save();

    const token = signToken({ id: newUser.id });
    const encryptedToken = encryptToken(token, process.env.JWT_ENCRYPTION_KEY!);

    res.cookie('token', encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict',
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id });
    const encryptedToken = encryptToken(token, process.env.JWT_ENCRYPTION_KEY!);

    res.cookie('token', encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
