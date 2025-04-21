import express from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (role !== 'employee' && role !== 'employer') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const userId = await UserService.createUser(email, password, role);

    // Generate JWT token
    const payload = { id: userId, email, role };
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const options: jwt.SignOptions = { 
      expiresIn: '24h' // Using a valid string format for expiresIn
    };
    const token = jwt.sign(payload, secret, options);

    res.status(201).json({
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Find user
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await UserService.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { id: user.id, email: user.email, role: user.role };
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const options: jwt.SignOptions = { 
      expiresIn: '24h' // Using a valid string format for expiresIn
    };
    const token = jwt.sign(payload, secret, options);

    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 