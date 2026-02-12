const mongoose = require('mongoose');
const { randomUUID } = require("crypto");
const { validatePassword } = require('../utils/password.js');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['manager', 'volunteer', 'parent', 'school', 'temporary'],
    required: true,
  },
  password: {
    type: String,
    required: false
  },
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  // School/Academy unique code
  uniqueCode: {
    type: String,
    required: function () {
      return this.role === 'school';
    },
    unique: true,
    sparse: true
  },
  // Parent specific fields
  phoneNumber: {
    type: String,
    required: false
  },
  countryCode: {
    type: String,
    required: false
  },
  // School specific fields
  schoolType: {
    type: String,
    enum: ['school', 'academy'],
    required: function () {
      return this.role === 'school';
    }
  },
  contactPersonName: {
    type: String,
    required: function () {
      return this.role === 'school';
    }
  },
  contactPersonPhone: {
    type: String,
    required: function () {
      return this.role === 'school';
    }
  },
  address: {
    type: String,
    required: function () {
      return this.role === 'school';
    }
  },
  checkpoint: {
    type: String,
  },
  provideVenue: {
    type: Boolean,
    default: false,
    required: function () {
      return this.role === 'school';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: String,
    unique: true,
    index: true,
    default: () => randomUUID(),
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return this.role === 'volunteer';
    }
  }
}, {
  versionKey: false,
});

// Add password validation method
schema.methods.validatePassword = async function (password) {
  if (!this.password) return false;
  return validatePassword(password, this.password);
};

schema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;
    delete ret.otp;
    delete ret.otpExpires;
    return ret;
  },
});

const User = mongoose.model('User', schema);

module.exports = User;