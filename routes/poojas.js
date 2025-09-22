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
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    const poojas = await Pooja.find(filter).populate('services collections category').sort({ createdAt: -1 });
    const Category = require('../models/Category');
    const categories = await Category.find({ isActive: true }).select('name slug');
    
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
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    const poojas = await Pooja.find(filter).populate('services collections category').sort({ createdAt: -1 });
    const Category = require('../models/Category');
    const categories = await Category.find().select('name slug');
    
    res.json({ success: true, data: poojas, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pooja by slug (must be before /:id route)
router.get('/slug/:slug', async (req, res) => {
  try {
    const pooja = await Pooja.findOne({ slug: req.params.slug, isActive: true })
      .populate('services collections category');
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Pooja not found' });
    }
    // Sort FAQs by order
    if (pooja.faqs && pooja.faqs.length > 0) {
      pooja.faqs.sort((a, b) => a.order - b.order);
    }
    res.json({ success: true, data: pooja });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pooja by ID
router.get('/:id', async (req, res) => {
  try {
    const pooja = await Pooja.findById(req.params.id)
      .populate('services collections category');
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Pooja not found' });
    }
    // Sort FAQs by order
    if (pooja.faqs && pooja.faqs.length > 0) {
      pooja.faqs.sort((a, b) => a.order - b.order);
    }
    res.json({ success: true, data: pooja });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create pooja
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, services, collections, faqs, isActive } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const pooja = new Pooja({ 
      title, 
      description, 
      category, 
      image, 
      services: services ? JSON.parse(services) : [],
      collections: collections ? JSON.parse(collections) : [],
      faqs: faqs ? JSON.parse(faqs) : [],
      isActive 
    });
    await pooja.save();
    
    res.status(201).json({ success: true, data: pooja });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update pooja
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, services, collections, faqs, isActive } = req.body;
    const updateData = { 
      title, 
      description, 
      category, 
      services: services ? JSON.parse(services) : [],
      collections: collections ? JSON.parse(collections) : [],
      faqs: faqs ? JSON.parse(faqs) : [],
      isActive 
    };
    
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