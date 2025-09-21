const express = require('express');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const router = express.Router();

// Get all services
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
    
    const services = await Service.find(filter).sort({ createdAt: -1 });
    const categories = await Service.distinct('category', { isActive: true });
    
    res.json({ success: true, data: services, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all services (admin)
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
    
    const services = await Service.find(filter).sort({ createdAt: -1 });
    const categories = await Service.distinct('category');
    
    res.json({ success: true, data: services, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get service by slug (must be before /:id route)
router.get('/slug/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    // Sort FAQs by order
    if (service.faqs && service.faqs.length > 0) {
      service.faqs.sort((a, b) => a.order - b.order);
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    // Sort FAQs by order
    if (service.faqs && service.faqs.length > 0) {
      service.faqs.sort((a, b) => a.order - b.order);
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create service
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, price, faqs, isActive } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const service = new Service({ 
      title, 
      description, 
      category, 
      image, 
      price, 
      faqs: faqs ? JSON.parse(faqs) : [],
      isActive 
    });
    await service.save();
    
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update service
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, price, faqs, isActive } = req.body;
    const updateData = { 
      title, 
      description, 
      category, 
      price, 
      faqs: faqs ? JSON.parse(faqs) : [],
      isActive 
    };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete service
router.delete('/:id', auth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;