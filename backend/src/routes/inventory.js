const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// GET all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add inventory item
router.post('/', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;

    if (!name || quantity === undefined || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const item = new Inventory({ name, quantity, price });
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update inventory item
router.put('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    item.name = req.body.name || item.name;
    item.quantity = req.body.quantity !== undefined ? req.body.quantity : item.quantity;
    item.price = req.body.price || item.price;
    item.updatedAt = new Date();

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE inventory item
router.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
