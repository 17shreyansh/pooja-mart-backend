const mongoose = require('mongoose');
const HomePage = require('../models/HomePage');
require('dotenv').config();

const seedHomePageData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await HomePage.deleteMany({});

    // Hero Section
    await HomePage.create({
      section: 'hero',
      content: {
        title: 'Pooja Samagri, Prasad & Pandit Ji – All at One Place',
        description: 'Complete Devotional Service at Your Doorstep – For Peace, Happiness & Prosperity',
        phone: '8929255775',
        backgroundImage: '/assets/hero-bg.jpg',
        bannerImage: '/assets/hero-1.png'
      }
    });

    // How It Works Section
    await HomePage.create({
      section: 'howItWorks',
      content: {
        heading: 'How It works',
        steps: [
          {
            number: '01',
            title: 'Select Pooja or Product',
            description: 'Browse and pick Pooja kits & items',
            image: '/assets/step1.png'
          },
          {
            number: '02',
            title: 'Customize & Book',
            description: 'Choose date, time & purpose (for pooja)',
            image: '/assets/step2.png'
          },
          {
            number: '03',
            title: 'Easy Payment',
            description: 'Secure online transactions',
            image: '/assets/step3.png'
          },
          {
            number: '04',
            title: 'Experience the Divine',
            description: 'Pandit Ji performs rituals or products reach home',
            image: '/assets/step4.png'
          }
        ],
        buttons: ['Get Prasad', 'Book Pandit ji', 'Order Pooja Kit', 'Vastu Consultation']
      }
    });

    // CTA Section
    await HomePage.create({
      section: 'cta',
      content: {
        ctaTitle: 'Book Your Pooja. Shop Divine Essentials.',
        ctaButtonText: 'Book a Pooja',
        ctaBackgroundImage: '/assets/ctaBG.jpg'
      }
    });

    console.log('Home page data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding home page data:', error);
    process.exit(1);
  }
};

seedHomePageData();