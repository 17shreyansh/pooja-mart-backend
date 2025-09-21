const mongoose = require('mongoose');
const Service = require('../models/Service');
require('dotenv').config();

const updateSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const services = await Service.find({});
    
    for (const service of services) {
      if (!service.slug) {
        service.slug = service.title.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
        
        await service.save();
        console.log(`Updated slug for: ${service.title} -> ${service.slug}`);
      }
    }
    
    console.log('Service slug update completed');
    process.exit(0);
  } catch (error) {
    console.error('Error updating slugs:', error);
    process.exit(1);
  }
};

updateSlugs();