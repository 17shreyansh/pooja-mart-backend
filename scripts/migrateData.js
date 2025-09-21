const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Pooja = require('../models/Pooja');
const Service = require('../models/Service');
const PoojaCollection = require('../models/PoojaCollection');

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pujamart');
    console.log('Connected to MongoDB');

    // Migrate Poojas: subtitle -> description
    console.log('Migrating Poojas...');
    const poojas = await Pooja.find({});
    for (const pooja of poojas) {
      if (pooja.subtitle && !pooja.description) {
        pooja.description = pooja.subtitle;
        pooja.category = pooja.category || 'General';
        pooja.packages = pooja.packages || [];
        await pooja.save();
        console.log(`Migrated pooja: ${pooja.title}`);
      }
    }

    // Migrate Services: subtitle -> description, add price and duration
    console.log('Migrating Services...');
    const services = await Service.find({});
    for (const service of services) {
      if (service.subtitle && !service.description) {
        service.description = service.subtitle;
        service.price = service.price || 500; // Default price
        await service.save();
        console.log(`Migrated service: ${service.title}`);
      }
    }

    // Migrate PoojaCollections: subtitle1, subtitle2 -> description, add items and price
    console.log('Migrating Pooja Collections...');
    const collections = await PoojaCollection.find({});
    for (const collection of collections) {
      if ((collection.subtitle1 || collection.subtitle2) && !collection.description) {
        collection.description = `${collection.subtitle1 || ''} ${collection.subtitle2 || ''}`.trim();

        collection.price = collection.price || 1000; // Default price
        collection.stock = collection.stock || 10; // Default stock
        collection.attributes = collection.attributes || []; // Default attributes
        await collection.save();
        console.log(`Migrated collection: ${collection.title}`);
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData();