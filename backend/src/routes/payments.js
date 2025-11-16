const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// GET all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().populate('bookingId userId');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create payment
router.post('/', async (req, res) => {
  try {
    const { bookingId, userId, amount, method } = req.body;

    if (!bookingId || !userId || !amount || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payment = new Payment({
      bookingId,
      userId,
      amount,
      method,
      status: 'completed',
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
