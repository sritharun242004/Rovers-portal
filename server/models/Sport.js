const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  duration: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  mapsPin: {
    type: String,
    default: ''
  },
  registrationOpening: {
    type: Date,
    default: null
  },
  registrationClosure: {
    type: Date,
    default: null
  },
  hide :{
    type: Boolean,
    default: false
  },
  registrationFee: {
    type: Number,
    default: 0,
    comment: 'Registration fee in cents (e.g., 10000 = RM 100)'
  },
  ageCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AgeCategory'
  }],
  distances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Distance'
  }],
  sportSubTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SportSubType'
  }]
}, {
  timestamps: true,
  versionKey: false
});

const Sport = mongoose.model('Sport', schema);

module.exports = Sport;