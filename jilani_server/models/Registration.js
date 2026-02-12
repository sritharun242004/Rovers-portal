const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  ageCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AgeCategory'
  },
  distance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Distance'
  },
  sportSubType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SportSubType'
  },
  isGroupRegistration: {
    type: Boolean,
    default: false
  },
  groupRegistrationId: {
    type: String,
    sparse: true
  },
  // New field for substitute status
  isSubstitute: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentScreenshot: {
    type: String
  },
  transactionId: {
    type: String
  },
  referenceNumber: {
    type: String,
    required: false
  },
  // Payment-related fields
  paymentStatus: {
    type: String,
    enum: ['free', 'paid', 'pending', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'razorpay', 'manual', 'free', 'bank_transfer'],
    default: 'manual',
    required: false
  },
  academyCode: {
    type: String
  },
  paymentIntentId: {
    type: String
  },
  paymentAmount: {
    type: Number
  },
  paymentCurrency: {
    type: String
  },
  country: {
    type: String
  },
  includeCertification: {
    type: Boolean,
    default: false
  },
  registrationType: {
    type: String,
    enum: ['online_payment', 'manual', 'school_bulk'],
    default: 'manual'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

const Registration = mongoose.model('Registration', schema);

module.exports = Registration;