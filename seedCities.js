const mongoose = require('mongoose');
const City = require('./models/City');
require('dotenv').config();

const cities = [
  { name: 'Mumbai', state: 'Maharashtra', isActive: true },
  { name: 'Delhi', state: 'Delhi', isActive: true },
  { name: 'Bangalore', state: 'Karnataka', isActive: true },
  { name: 'Hyderabad', state: 'Telangana', isActive: true },
  { name: 'Chennai', state: 'Tamil Nadu', isActive: true },
  { name: 'Kolkata', state: 'West Bengal', isActive: true },
  { name: 'Pune', state: 'Maharashtra', isActive: true },
  { name: 'Ahmedabad', state: 'Gujarat', isActive: true },
  { name: 'Jaipur', state: 'Rajasthan', isActive: true },
  { name: 'Surat', state: 'Gujarat', isActive: true },
  { name: 'Lucknow', state: 'Uttar Pradesh', isActive: true },
  { name: 'Kanpur', state: 'Uttar Pradesh', isActive: true },
  { name: 'Nagpur', state: 'Maharashtra', isActive: true },
  { name: 'Indore', state: 'Madhya Pradesh', isActive: true },
  { name: 'Thane', state: 'Maharashtra', isActive: true },
  { name: 'Bhopal', state: 'Madhya Pradesh', isActive: true },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', isActive: true },
  { name: 'Pimpri-Chinchwad', state: 'Maharashtra', isActive: true },
  { name: 'Patna', state: 'Bihar', isActive: true },
  { name: 'Vadodara', state: 'Gujarat', isActive: true }
];

const seedCities = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing cities
    await City.deleteMany({});
    console.log('Cleared existing cities');

    // Insert new cities
    await City.insertMany(cities);
    console.log('Cities seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding cities:', error);
    process.exit(1);
  }
};

seedCities();