const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Mock payments storage
let payments = [];

/**
 * GET all payments
 */
router.get('/', (req, res) => {
  res.json(payments);
});

/**
 * CREATE payment
 */
router.post('/', (req, res) => {
  const { bookingId, amount, paymentMethod, cardDetails } = req.body;

  if (!bookingId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const payment = {
    id: uuidv4(),
    bookingId,
    amount,
    paymentMethod,
    status: 'completed',
    createdAt: new Date(),
  };

  payments.push(payment);
  res.status(201).json(payment);
});

/**
 * GET payment by ID
 */
router.get('/:id', (req, res) => {
  const payment = payments.find(p => p.id === req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.json(payment);
});

module.exports = router;
