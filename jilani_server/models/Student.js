const mongoose = require('mongoose');

console.log('Initializing Student model with schema:', JSON.stringify({
  name: 'String (required)',
  uid: 'String (required, unique)',
  sport: 'ObjectId (required, ref: Sport)',
  event: 'ObjectId (ref: Event)',
  ageCategory: 'ObjectId (required, ref: AgeCategory)',
  distance: 'ObjectId (optional, ref: Distance) - only required for sports with distances',
  sportSubType: 'ObjectId (required, ref: SportSubType)',
  location: 'String (default: "")',
  status: 'String (enum: ["not visited", "entrance checkin", "sports checkin", "checkout"], default: "not visited")',
  photo: 'String (default: "")',
  dob: 'Date (default: null)',
  gender: 'String (enum: ["male", "female", "other"], default: "")',
  nationality: 'String (default: "")',
  nationalityCode: 'String (default: "")',
  city: 'String (default: "")',
  idProof: 'String (default: "")',
  inlineCategory: 'String (default: "")',
  isRepresentation: 'Boolean (default: false)',
  represents: 'String (default: "")',
  class: 'String (default: "")',
  bloodGroup: 'String (enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"], default: "Unknown")',
  medicalConditions: 'String (default: "")',
  qrcode: 'String (default: "")',
  sportStartDate: 'Date (default: null)',
  sportEndDate: 'Date (default: null)'
}));

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true,
    unique: true
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true
  },
  // New fields for relationships
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  ageCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AgeCategory',
    required: true
  },
  distance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Distance',
    required: false // Made optional since some sports don't require distances
  },
  sportSubType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SportSubType',
    required: false
  },
  location: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['not visited', 'entrance checkin', 'sports checkin', 'checkout'],
    default: 'not visited'
  },
  photo: {
    type: String,
    default: ''
  },
  dob: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
    // No default - field will be undefined if not provided
  },
  nationality: {
    type: String,
    default: ''
  },
  nationalityCode: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  idProof: {
    type: String,
    default: ''
  },
  inlineCategory: {
    type: String,
    default: ''
  },
  isRepresentation: {
    type: Boolean,
    default: false
  },
  represents: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  medicalConditions: {
    type: String,
    default: ''
  },
  qrcode: {
    type: String,
    default: ''
  },
  sportStartDate: {
    type: Date,
    default: null
  },
  sportEndDate: {
    type: Date,
    default: null
  }
}, {
  versionKey: false,
  timestamps: true
});

const Student = mongoose.model('Student', schema);

module.exports = Student;