const express = require('express');
const multer = require('multer');
const path = require('path');
const Offer = require('../models/Offer');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'offer-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
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

// Get active offers for public (slider and popup)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ priority: -1, createdAt: -1 });

    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get slider offers
router.get('/slider', async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      showInSlider: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ priority: -1, createdAt: -1 });

    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get popup offers
router.get('/popup', async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      showInPopup: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ priority: -1, createdAt: -1 }).limit(1);

    res.json({ success: true, offer: offers[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin routes (protected)
router.get('/admin', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { offerCode: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const offers = await Offer.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Offer.countDocuments(query);

    res.json({
      success: true,
      offers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create offer
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const offerData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      showInSlider: req.body.showInSlider === 'true',
      showInPopup: req.body.showInPopup === 'true',
      isActive: req.body.isActive !== 'false'
    };

    const offer = new Offer(offerData);
    await offer.save();

    res.status(201).json({ success: true, offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update offer
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      showInSlider: req.body.showInSlider === 'true',
      showInPopup: req.body.showInPopup === 'true',
      isActive: req.body.isActive !== 'false'
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const offer = await Offer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.json({ success: true, offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete offer
router.delete('/:id', auth, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;