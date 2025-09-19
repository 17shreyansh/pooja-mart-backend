const express = require('express');
const Service = require('../models/Service');
const Pooja = require('../models/Pooja');
const PoojaCollection = require('../models/PoojaCollection');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');
const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [servicesCount, poojasCount, collectionCount, testimonialsCount] = await Promise.all([
      Service.countDocuments(),
      Pooja.countDocuments(),
      PoojaCollection.countDocuments(),
      Testimonial.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        services: servicesCount,
        poojas: poojasCount,
        collection: collectionCount,
        testimonials: testimonialsCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;