const express = require('express');
const Pooja = require('../models/Pooja');
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const router = express.Router();

// Get all poojas
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    const poojas = await Pooja.find(filter).sort({ createdAt: -1 });
    const categories = await Pooja.distinct('category', { isActive: true });
    
    res.json({ success: true, data: poojas, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all poojas (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    const poojas = await Pooja.find(filter).sort({ createdAt: -1 });
    const categories = await Pooja.distinct('category');
    
    res.json({ success: true, data: poojas, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create pooja
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, category, isActive } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const pooja = new Pooja({ title, subtitle, category, image, isActive });
    await pooja.save();
    
    res.status(201).json({ success: true, data: pooja });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update pooja
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, category, isActive } = req.body;
    const updateData = { title, subtitle, category, isActive };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const pooja = await Pooja.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: pooja });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete pooja
router.delete('/:id', auth, async (req, res) => {
  try {
    await Pooja.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Pooja deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;