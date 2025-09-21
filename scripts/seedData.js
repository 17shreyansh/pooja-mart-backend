const mongoose = require('mongoose');
require('dotenv').config();

const Pooja = require('../models/Pooja');
const Service = require('../models/Service');
const PoojaCollection = require('../models/PoojaCollection');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pujamart');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Pooja.deleteMany({});
    await Service.deleteMany({});
    await PoojaCollection.deleteMany({});
    console.log('Cleared existing data');

    // Seed Services
    const services = await Service.insertMany([
      {
        title: 'Experienced Pandit Service',
        description: 'Highly experienced and knowledgeable pandits for all types of religious ceremonies and poojas. Well-versed in Sanskrit mantras and traditional rituals.',
        category: 'Priest Services',
        price: 1500,
        image: '/uploads/pandit-service.jpg'
      },
      {
        title: 'Home Decoration Service',
        description: 'Professional decoration service for your home during festivals and special occasions. Includes rangoli, flower arrangements, and traditional decorations.',
        category: 'Decoration',
        price: 800,
        image: '/uploads/decoration.jpg'
      },
      {
        title: 'Catering Service',
        description: 'Traditional vegetarian catering service for religious ceremonies. Includes prasadam preparation and serving arrangements.',
        category: 'Catering',
        price: 2000,
        image: '/uploads/catering.jpg'
      },
      {
        title: 'Photography Service',
        description: 'Professional photography and videography service to capture your special religious moments and ceremonies.',
        category: 'Photography',
        price: 1200,
        image: '/uploads/photography.jpg'
      }
    ]);

    // Seed Collections
    const collections = await PoojaCollection.insertMany([
      {
        title: 'Ganesh Chaturthi Complete Kit',
        description: 'Everything you need for a perfect Ganesh Chaturthi celebration at home. Includes eco-friendly idol and all essential pooja items.',
        category: 'Festival Kits',
        price: 850,
        stock: 25,
        attributes: [
          { name: 'Weight', value: '2.5 kg' },
          { name: 'Material', value: 'Eco-friendly clay' },
          { name: 'Size', value: 'Medium (8 inches)' },
          { name: 'Includes', value: 'Ganesh Idol, Pooja Thali, Modak Mould, Flowers' }
        ],
        image: '/uploads/ganesh-kit.jpg'
      },
      {
        title: 'Diwali Celebration Package',
        description: 'Complete Diwali celebration package with diyas, rangoli materials, and festive decorations for your home.',
        category: 'Festival Kits',
        price: 1200,
        stock: 15,
        attributes: [
          { name: 'Items Count', value: '50+ pieces' },
          { name: 'Light Type', value: 'LED (Safe)' },
          { name: 'Duration', value: 'Lasts 5 days' },
          { name: 'Includes', value: 'Clay Diyas, Rangoli Colors, LED Lights, Lakshmi Idol' }
        ],
        image: '/uploads/diwali-kit.jpg'
      },
      {
        title: 'Daily Pooja Essentials',
        description: 'Essential items for daily worship and prayers. Perfect for regular home pooja rituals.',
        category: 'Daily Worship',
        price: 450,
        stock: 50,
        attributes: [
          { name: 'Usage', value: 'Daily worship' },
          { name: 'Purity', value: '100% Natural' },
          { name: 'Shelf Life', value: '6 months' },
          { name: 'Includes', value: 'Brass Diya, Incense Sticks, Camphor, Kumkum & Turmeric' }
        ],
        image: '/uploads/daily-pooja.jpg'
      }
    ]);

    // Seed Poojas with Packages
    const poojas = await Pooja.insertMany([
      {
        title: 'Ganesh Chaturthi Celebration',
        description: 'Complete Ganesh Chaturthi celebration with traditional rituals, mantras, and ceremonies. Includes Ganesh sthapana, daily aarti, and visarjan ceremony.',
        category: 'Festival',
        packages: [
          {
            name: 'Basic Package',
            description: 'Essential Ganesh Chaturthi celebration with pandit service and basic pooja items',
            services: [services[0]._id],
            collections: [collections[0]._id],
            price: 2350
          },
          {
            name: 'Premium Package',
            description: 'Complete celebration with decoration, catering, and photography',
            services: [services[0]._id, services[1]._id, services[2]._id, services[3]._id],
            collections: [collections[0]._id],
            price: 6350
          }
        ],
        image: '/uploads/ganesh-pooja.jpg'
      },
      {
        title: 'Lakshmi Pooja',
        description: 'Traditional Lakshmi pooja for prosperity and wealth. Perfect for Diwali or any auspicious occasion to invite goddess Lakshmi into your home.',
        category: 'Festival',
        packages: [
          {
            name: 'Standard Package',
            description: 'Traditional Lakshmi pooja with experienced pandit and Diwali essentials',
            services: [services[0]._id],
            collections: [collections[1]._id],
            price: 2700
          },
          {
            name: 'Deluxe Package',
            description: 'Complete Diwali celebration with decoration and catering',
            services: [services[0]._id, services[1]._id, services[2]._id],
            collections: [collections[1]._id],
            price: 5000
          }
        ],
        image: '/uploads/lakshmi-pooja.jpg'
      },
      {
        title: 'Griha Pravesh Pooja',
        description: 'Auspicious house warming ceremony to purify and bless your new home. Includes Vastu pooja and Ganesh sthapana for positive energy.',
        category: 'Special Occasion',
        packages: [
          {
            name: 'Essential Package',
            description: 'Basic griha pravesh rituals with pandit service',
            services: [services[0]._id],
            collections: [collections[2]._id],
            price: 1950
          },
          {
            name: 'Complete Package',
            description: 'Full ceremony with decoration and photography',
            services: [services[0]._id, services[1]._id, services[3]._id],
            collections: [collections[2]._id],
            price: 4450
          }
        ],
        image: '/uploads/griha-pravesh.jpg'
      },
      {
        title: 'Satyanarayan Pooja',
        description: 'Sacred Satyanarayan Katha and pooja for fulfillment of wishes and removal of obstacles. Includes prasadam preparation and distribution.',
        category: 'Special Occasion',
        packages: [
          {
            name: 'Traditional Package',
            description: 'Complete Satyanarayan pooja with katha and prasadam',
            services: [services[0]._id, services[2]._id],
            collections: [collections[2]._id],
            price: 3950
          }
        ],
        image: '/uploads/satyanarayan.jpg'
      },
      {
        title: 'Navratri Celebration',
        description: 'Nine-day Navratri celebration with daily aarti, bhajans, and special rituals for Goddess Durga. Includes all nine forms worship.',
        category: 'Festival',
        packages: [
          {
            name: 'Daily Aarti Package',
            description: 'Daily evening aarti for all 9 days of Navratri',
            services: [services[0]._id],
            collections: [collections[2]._id],
            price: 4500
          },
          {
            name: 'Grand Celebration',
            description: 'Complete Navratri with decoration, catering, and photography',
            services: [services[0]._id, services[1]._id, services[2]._id, services[3]._id],
            collections: [collections[2]._id],
            price: 12000
          }
        ],
        image: '/uploads/navratri.jpg'
      },
      {
        title: 'Karva Chauth Pooja',
        description: 'Traditional Karva Chauth fast and pooja for married women. Includes moon sighting ritual and fast-breaking ceremony.',
        category: 'Special Occasion',
        packages: [
          {
            name: 'Traditional Package',
            description: 'Complete Karva Chauth pooja with traditional rituals',
            services: [services[0]._id],
            collections: [collections[2]._id],
            price: 1950
          }
        ],
        image: '/uploads/karva-chauth.jpg'
      }
    ]);

    console.log(`Seeded ${services.length} services`);
    console.log(`Seeded ${collections.length} collections`);
    console.log(`Seeded ${poojas.length} poojas`);
    console.log('Seed data created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();