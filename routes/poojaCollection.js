const express = require('express');
const PoojaCollection = require('../models/PoojaCollection');
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const router = express.Router();

// Get all pooja collection items
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle1: { $regex: search, $options: 'i' } },
        { subtitle2: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    const items = await PoojaCollection.find(filter).sort({ createdAt: -1 });
    const categories = await PoojaCollection.distinct('category', { isActive: true });
    
    res.json({ success: true, data: items, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all pooja collection items (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle1: { $regex: search, $options: 'i' } },
        { subtitle2: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    const items = await PoojaCollection.find(filter).sort({ createdAt: -1 });
    const categories = await PoojaCollection.distinct('category');
    
    res.json({ success: true, data: items, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create pooja collection item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle1, subtitle2, category, isActive } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const item = new PoojaCollection({ title, subtitle1, subtitle2, category, image, isActive });
    await item.save();
    
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update pooja collection item
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle1, subtitle2, category, isActive } = req.body;
    const updateData = { title, subtitle1, subtitle2, category, isActive };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const item = await PoojaCollection.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete pooja collection item
router.delete('/:id', auth, async (req, res) => {
  try {
    await PoojaCollection.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;