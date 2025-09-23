const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationOTP = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

userSchema.methods.verifyOTP = function(otp) {
  return this.emailVerificationOTP === otp && this.otpExpiry > new Date();
};

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);