const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage
let payments = [];

// GET all payments
router.get('/', (req, res) => {
  res.json(payments);
});

// POST create payment
router.post('/', (req, res) => {
  const { bookingId, userId, amount, method } = req.body;

  if (!bookingId || !userId || !amount || !method) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const payment = {
    id: uuidv4(),
    bookingId,
    userId,
    amount,
    method,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };

  payments.push(payment);
  res.status(201).json(payment);
});

module.exports = router;
