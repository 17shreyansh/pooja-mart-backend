const mongoose = require('mongoose');
const Pooja = require('../models/Pooja');
const Service = require('../models/Service');
const PoojaCollection = require('../models/PoojaCollection');
require('dotenv').config();

const generateSlug = (title) => {
  return title.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

const updateSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update Poojas
    const poojas = await Pooja.find({});
    console.log(`Updating ${poojas.length} poojas...`);
    
    for (const pooja of poojas) {
      if (!pooja.slug) {
        pooja.slug = generateSlug(pooja.title);
        await pooja.save();
        console.log(`Updated pooja: ${pooja.title} -> ${pooja.slug}`);
      }
    }

    // Update Services
    const services = await Service.find({});
    console.log(`Updating ${services.length} services...`);
    
    for (const service of services) {
      if (!service.slug) {
        service.slug = generateSlug(service.title);
        await service.save();
        console.log(`Updated service: ${service.title} -> ${service.slug}`);
      }
    }

    // Update Collections
    const collections = await PoojaCollection.find({});
    console.log(`Updating ${collections.length} collections...`);
    
    for (const collection of collections) {
      if (!collection.slug) {
        collection.slug = generateSlug(collection.title);
        await collection.save();
        console.log(`Updated collection: ${collection.title} -> ${collection.slug}`);
      }
    }

    console.log('All slugs updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating slugs:', error);
    process.exit(1);
  }
};

updateSlugs();