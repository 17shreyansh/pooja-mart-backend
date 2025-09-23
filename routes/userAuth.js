const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../services/emailService');
const router = express.Router();

// Send OTP for email verification
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ email });
    }
    
    const otp = user.generateOTP();
    await user.save();
    
    await sendOTPEmail(email, otp);
    
    res.json({
      success: true,
      message: 'OTP sent to your email',
      email: email
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify OTP and complete registration
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email },
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// User login with OTP
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email, isActive: true, isEmailVerified: true });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or not verified' });
    }
    
    const otp = user.generateOTP();
    await user.save();
    
    await sendOTPEmail(email, otp);
    
    res.json({
      success: true,
      message: 'OTP sent to your email',
      email: email
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify login OTP
router.post('/verify-login-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email, isActive: true, isEmailVerified: true });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    
    user.emailVerificationOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});



module.exports = router;