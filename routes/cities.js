const express = require('express');
const router = express.Router();
const City = require('../models/City');
const auth = require('../middleware/auth');

// Get all active cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin routes
router.get('/admin', auth, async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin', auth, async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json({ success: true, data: city });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/admin/:id', auth, async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: city });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/admin/:id', auth, async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'City deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;