const express = require('express');
const router = express.Router();

// In-memory storage
const services = [
  {
    id: '1',
    name: 'Birthday Party Planning',
    category: 'party-planning',
    description: 'Complete birthday party coordination',
    price: 500,
  },
  {
    id: '2',
    name: 'Wedding Planning',
    category: 'party-planning',
    description: 'Full wedding coordination and planning',
    price: 2000,
  },
  {
    id: '3',
    name: 'Table & Chair Rental',
    category: 'equipment-rental',
    description: 'Premium tables and chairs for any event',
    price: 100,
  },
  {
    id: '4',
    name: 'Sound System Rental',
    category: 'equipment-rental',
    description: 'Professional sound equipment rental',
    price: 300,
  },
  {
    id: '5',
    name: 'Catering - Small',
    category: 'catering',
    description: 'Catering for up to 50 guests',
    price: 800,
  },
  {
    id: '6',
    name: 'Catering - Large',
    category: 'catering',
    description: 'Catering for up to 200 guests',
    price: 2500,
  },
];

// GET all services
router.get('/', (req, res) => {
  res.json(services);
});

// GET service by ID
router.get('/:id', (req, res) => {
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(service);
});

// GET services by category
router.get('/category/:category', (req, res) => {
  const categoryServices = services.filter(s => s.category === req.params.category);
  res.json(categoryServices);
});

module.exports = router;
