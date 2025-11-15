const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage (replace with database in production)
let bookings = [];

/**
 * GET all bookings
 */
router.get('/', (req, res) => {
  res.json(bookings);
});

/**
 * GET booking by ID
 */
router.get('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

/**
 * CREATE new booking
 */
router.post('/', (req, res) => {
  const { serviceId, userId, date, guestCount, specialRequests } = req.body;

  if (!serviceId || !userId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const booking = {
    id: uuidv4(),
    serviceId,
    userId,
    date,
    guestCount,
    specialRequests,
    status: 'pending',
    createdAt: new Date(),
  };

  bookings.push(booking);
  res.status(201).json(booking);
});

/**
 * UPDATE booking
 */
router.put('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  Object.assign(booking, req.body, { id: booking.id });
  res.json(booking);
});

/**
 * DELETE booking
 */
router.delete('/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bookings.splice(index, 1);
  res.json({ message: 'Booking deleted' });
});

module.exports = router;
