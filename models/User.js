const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing passwords...'); // Debug log
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No'); // Debug log
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error); // Debug log
    return false;
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
