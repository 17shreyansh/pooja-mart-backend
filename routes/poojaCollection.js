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
        { description: { $regex: search, $options: 'i' } }
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
        { description: { $regex: search, $options: 'i' } }
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

// Get collection by slug (must be before /:id route)
router.get('/slug/:slug', async (req, res) => {
  try {
    const collection = await PoojaCollection.findOne({ slug: req.params.slug, isActive: true })
      .populate({
        path: 'faqs',
        match: { isActive: true },
        options: { sort: { order: 1, createdAt: 1 } }
      });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get collection by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await PoojaCollection.findById(req.params.id)
      .populate({
        path: 'faqs',
        match: { isActive: true },
        options: { sort: { order: 1, createdAt: 1 } }
      });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create pooja collection item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, price, stock, attributes, isActive } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const collection = new PoojaCollection({ 
      title, 
      description, 
      category, 
      image, 
      price,
      stock: stock || 0,
      attributes: attributes ? JSON.parse(attributes) : [],
      isActive 
    });
    await collection.save();
    
    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update pooja collection item
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, price, stock, attributes, isActive } = req.body;
    const updateData = { 
      title, 
      description, 
      category, 
      price,
      stock: stock || 0,
      attributes: attributes ? JSON.parse(attributes) : [],
      isActive 
    };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const collection = await PoojaCollection.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: collection });
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

// Get FAQs for a specific collection
router.get('/:id/faqs', async (req, res) => {
  try {
    const FAQ = require('../models/FAQ');
    const faqs = await FAQ.find({ 
      entityType: 'collection', 
      entityId: req.params.id, 
      isActive: true 
    }).sort({ order: 1, createdAt: 1 });
    
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;