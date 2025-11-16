const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, role: user.role },
      token: `fake-jwt-token-${user._id}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = new User({
      email,
      password,
      role: 'customer',
    });

    await newUser.save();

    res.status(201).json({
      message: 'Registration successful',
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
      token: `fake-jwt-token-${newUser._id}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
