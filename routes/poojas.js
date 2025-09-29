const express = require('express');
const Pooja = require('../models/Pooja');
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const router = express.Router();

// Get all poojas
router.get('/', async (req, res) => {
  try {
    const { search, service, city } = req.query;
    const filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (service) {
      filter.service = service;
    }
    
    if (city) {
      filter.cities = city;
    }
    
    const poojas = await Pooja.find(filter)
      .populate('service')
      .populate('cities')
      .populate({
        path: 'packages.collections',
        model: 'PoojaCollection'
      })
      .sort({ createdAt: -1 });
    const Service = require('../models/Service');
    const services = await Service.find({ isActive: true }).select('name slug image');
    
    res.json({ success: true, data: poojas, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all poojas (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    const { search, service } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (service) {
      filter.service = service;
    }
    
    const poojas = await Pooja.find(filter)
      .populate('service')
      .populate('cities')
      .populate({
        path: 'packages.collections',
        model: 'PoojaCollection'
      })
      .sort({ createdAt: -1 });
    const Service = require('../models/Service');
    const services = await Service.find().select('name slug image');
    
    res.json({ success: true, data: poojas, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pooja by slug (must be before /:id route)
router.get('/slug/:slug', async (req, res) => {
  try {
    const pooja = await Pooja.findOne({ slug: req.params.slug, isActive: true })
      .populate('service')
      .populate('cities')
      .populate({
        path: 'packages.collections',
        model: 'PoojaCollection'
      });
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
      .populate('service')
      .populate('cities')
      .populate({
        path: 'packages.collections',
        model: 'PoojaCollection'
      });
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
router.post('/', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'showcaseImages', maxCount: 10 }]), async (req, res) => {
  try {
    const { title, description, service, packages, faqs, cities, isActive } = req.body;
    const image = req.files?.image?.[0] ? `/uploads/${req.files.image[0].filename}` : '';
    const showcaseImages = req.files?.showcaseImages ? req.files.showcaseImages.map(file => `/uploads/${file.filename}`) : [];
    
    const pooja = new Pooja({ 
      title, 
      description, 
      service, 
      image, 
      showcaseImages,
      packages: packages ? JSON.parse(packages) : [],
      faqs: faqs ? JSON.parse(faqs) : [],
      cities: cities ? JSON.parse(cities) : [],
      isActive 
    });
    await pooja.save();
    
    res.status(201).json({ success: true, data: pooja });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update pooja
router.put('/:id', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'showcaseImages', maxCount: 10 }]), async (req, res) => {
  try {
    const { title, description, service, packages, faqs, cities, isActive } = req.body;
    const updateData = { 
      title, 
      description, 
      service, 
      packages: packages ? JSON.parse(packages) : [],
      faqs: faqs ? JSON.parse(faqs) : [],
      cities: cities ? JSON.parse(cities) : [],
      isActive 
    };
    
    if (req.files?.image?.[0]) {
      updateData.image = `/uploads/${req.files.image[0].filename}`;
    }
    
    if (req.files?.showcaseImages) {
      updateData.showcaseImages = req.files.showcaseImages.map(file => `/uploads/${file.filename}`);
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