const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage
let inventory = [
  { id: uuidv4(), name: 'Tables', quantity: 50, price: 25 },
  { id: uuidv4(), name: 'Chairs', quantity: 200, price: 5 },
  { id: uuidv4(), name: 'Tents', quantity: 10, price: 150 },
  { id: uuidv4(), name: 'Sound System', quantity: 5, price: 300 },
];

// GET all inventory
router.get('/', (req, res) => {
  res.json(inventory);
});

// POST add inventory item
router.post('/', (req, res) => {
  const { name, quantity, price } = req.body;

  if (!name || quantity === undefined || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const item = {
    id: uuidv4(),
    name,
    quantity,
    price,
  };

  inventory.push(item);
  res.status(201).json(item);
});

// PUT update inventory item
router.put('/:id', (req, res) => {
  const item = inventory.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }

  item.name = req.body.name || item.name;
  item.quantity = req.body.quantity !== undefined ? req.body.quantity : item.quantity;
  item.price = req.body.price || item.price;

  res.json(item);
});

// DELETE inventory item
router.delete('/:id', (req, res) => {
  inventory = inventory.filter(i => i.id !== req.params.id);
  res.json({ message: 'Inventory item deleted' });
});

module.exports = router;
