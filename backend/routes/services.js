const express = require('express');
const router = express.Router();

// Mock services data
const services = [
  {
    id: '1',
    name: 'Birthday Party Planning',
    category: 'party-planning',
    price: 500,
    description: 'Complete birthday party coordination',
  },
  {
    id: '2',
    name: 'Wedding Planning',
    category: 'party-planning',
    price: 2000,
    description: 'Full wedding event coordination',
  },
  {
    id: '3',
    name: 'Table Rental',
    category: 'equipment-rental',
    price: 50,
    description: 'Premium table rentals',
  },
  {
    id: '4',
    name: 'Chair Rental',
    category: 'equipment-rental',
    price: 20,
    description: 'Comfortable chair rentals',
  },
  {
    id: '5',
    name: 'Catering - 50 Guests',
    category: 'catering',
    price: 800,
    description: 'Catering service for 50 guests',
  },
  {
    id: '6',
    name: 'Catering - 100 Guests',
    category: 'catering',
    price: 1500,
    description: 'Catering service for 100 guests',
  },
];

/**
 * GET all services
 */
router.get('/', (req, res) => {
  res.json(services);
});

/**
 * GET service by ID
 */
router.get('/:id', (req, res) => {
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(service);
});

/**
 * GET services by category
 */
router.get('/category/:category', (req, res) => {
  const categoryServices = services.filter(s => s.category === req.params.category);
  res.json(categoryServices);
});

module.exports = router;
