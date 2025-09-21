const mongoose = require('mongoose');
const Offer = require('../models/Offer');
require('dotenv').config();

const sampleOffers = [
  {
    title: "Diwali Special - 50% Off All Poojas",
    description: "Celebrate the festival of lights with our special Diwali offer. Get 50% discount on all pooja services.",
    image: "/uploads/diwali-offer.jpg", // You'll need to add actual images
    discountPercentage: 50,
    offerCode: "DIWALI50",
    startDate: new Date('2024-10-15'),
    endDate: new Date('2024-11-15'),
    isActive: true,
    showInSlider: true,
    showInPopup: true,
    priority: 10,
    buttonText: "Book Diwali Pooja",
    buttonLink: "/services"
  },
  {
    title: "Navratri Celebration Package",
    description: "Special Navratri package with Durga Pooja and Aarti services. Limited time offer!",
    image: "/uploads/navratri-offer.jpg",
    discountPercentage: 30,
    offerCode: "NAVRATRI30",
    startDate: new Date('2024-09-15'),
    endDate: new Date('2024-10-24'),
    isActive: true,
    showInSlider: true,
    showInPopup: false,
    priority: 8,
    buttonText: "Book Navratri Package",
    buttonLink: "/services"
  },
  {
    title: "New Year Blessing - Early Bird Offer",
    description: "Start your new year with divine blessings. Book early and save 25% on all services.",
    image: "/uploads/newyear-offer.jpg",
    discountPercentage: 25,
    offerCode: "NEWYEAR25",
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-01-31'),
    isActive: true,
    showInSlider: true,
    showInPopup: false,
    priority: 5,
    buttonText: "Book New Year Pooja",
    buttonLink: "/services"
  }
];

const seedOffers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing offers
    await Offer.deleteMany({});
    console.log('Cleared existing offers');

    // Insert sample offers
    await Offer.insertMany(sampleOffers);
    console.log('Sample offers created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding offers:', error);
    process.exit(1);
  }
};

seedOffers();