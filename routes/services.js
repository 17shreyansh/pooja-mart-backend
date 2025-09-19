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
        { subtitle: { $regex: search, $options: 'i' } }
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
        { subtitle: { $regex: search, $options: 'i' } }
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

// Create service
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, category, isActive } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const service = new Service({ title, subtitle, category, image, isActive });
    await service.save();
    
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update service
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, category, isActive } = req.body;
    const updateData = { title, subtitle, category, isActive };
    
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