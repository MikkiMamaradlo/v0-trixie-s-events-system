const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Mock users storage
let users = [
  { id: '1', email: 'admin@trixtech.com', password: 'admin123', role: 'admin' },
  { id: '2', email: 'user@example.com', password: 'user123', role: 'customer' },
];

/**
 * Register new user
 */
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const user = {
    id: uuidv4(),
    email,
    password, // In production, hash this!
    name,
    role: 'customer',
  };

  users.push(user);
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
});

/**
 * Login user
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    token: `token_${user.id}`,
  });
});

/**
 * Get current user
 */
router.get('/me', (req, res) => {
  // In production, verify token here
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = token.replace('token_', '');
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ id: user.id, email: user.email, role: user.role });
});

module.exports = router;
