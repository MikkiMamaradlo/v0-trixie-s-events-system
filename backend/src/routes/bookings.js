const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage (replace with database in production)
let bookings = [];

// GET all bookings
router.get('/', (req, res) => {
  res.json(bookings);
});

// GET booking by ID
router.get('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

// POST create new booking
router.post('/', (req, res) => {
  const { serviceId, userId, date, guestCount, totalPrice } = req.body;

  if (!serviceId || !userId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newBooking = {
    id: uuidv4(),
    serviceId,
    userId,
    date,
    guestCount,
    totalPrice,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// PUT update booking status
router.put('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const { status } = req.body;
  booking.status = status || booking.status;
  booking.updatedAt = new Date().toISOString();

  res.json(booking);
});

// DELETE booking
router.delete('/:id', (req, res) => {
  bookings = bookings.filter(b => b.id !== req.params.id);
  res.json({ message: 'Booking deleted' });
});

module.exports = router;
