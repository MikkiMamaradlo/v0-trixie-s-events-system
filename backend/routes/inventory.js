const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage
let inventory = [
  { id: '1', name: 'Wooden Table', quantity: 50, category: 'furniture' },
  { id: '2', name: 'Chair', quantity: 100, category: 'furniture' },
  { id: '3', name: 'Tent', quantity: 10, category: 'outdoor' },
  { id: '4', name: 'Sound System', quantity: 5, category: 'audio' },
];

/**
 * GET all inventory
 */
router.get('/', (req, res) => {
  res.json(inventory);
});

/**
 * GET inventory item by ID
 */
router.get('/:id', (req, res) => {
  const item = inventory.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

/**
 * CREATE inventory item
 */
router.post('/', (req, res) => {
  const { name, quantity, category } = req.body;

  if (!name || !quantity || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const item = {
    id: uuidv4(),
    name,
    quantity,
    category,
  };

  inventory.push(item);
  res.status(201).json(item);
});

/**
 * UPDATE inventory item
 */
router.put('/:id', (req, res) => {
  const item = inventory.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  Object.assign(item, req.body, { id: item.id });
  res.json(item);
});

/**
 * DELETE inventory item
 */
router.delete('/:id', (req, res) => {
  const index = inventory.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  inventory.splice(index, 1);
  res.json({ message: 'Item deleted' });
});

module.exports = router;
