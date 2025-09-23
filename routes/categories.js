const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'category-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories by type with items count
router.get('/by-type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let Model;
    
    switch (type) {
      case 'pooja':
        Model = require('../models/Pooja');
        break;
      case 'service':
        Model = require('../models/Service');
        break;
      case 'collections':
        Model = require('../models/PoojaCollection');
        break;
      default:
        return res.status(400).json({ message: 'Invalid type' });
    }
    
    const items = await Model.find({ isActive: true }).populate('category');
    const categoryMap = new Map();
    
    items.forEach(item => {
      if (item.category) {
        const catName = item.category.name;
        if (!categoryMap.has(catName)) {
          categoryMap.set(catName, {
            name: catName,
            slug: item.category.slug,
            count: 0
          });
        }
        categoryMap.get(catName).count++;
      }
    });
    
    const categories = Array.from(categoryMap.values());
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all categories for admin (including inactive)
router.get('/admin', auth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new category
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const category = new Category({
      name,
      description,
      image: req.file.filename
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Update category
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const updateData = { name, description, isActive };
    
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;