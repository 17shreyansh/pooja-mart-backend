const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ email: 'admin@pujamart.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = new Admin({
      name: 'Admin',
      email: 'admin@pujamart.com',
      password: 'admin123'
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: admin@pujamart.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();