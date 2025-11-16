const express = require('express');
const router = express.Router();

// Simple auth (replace with proper JWT in production)
const users = [
  { id: '1', email: 'admin@trixtech.com', password: 'admin123', role: 'admin' },
  { id: '2', email: 'user@trixtech.com', password: 'user123', role: 'customer' },
];

// POST login
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
    message: 'Login successful',
    user: { id: user.id, email: user.email, role: user.role },
    token: `fake-jwt-token-${user.id}`,
  });
});

// POST register
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser = {
    id: String(users.length + 1),
    email,
    password,
    role: 'customer',
  };

  users.push(newUser);

  res.status(201).json({
    message: 'Registration successful',
    user: { id: newUser.id, email: newUser.email, role: newUser.role },
    token: `fake-jwt-token-${newUser.id}`,
  });
});

module.exports = router;
