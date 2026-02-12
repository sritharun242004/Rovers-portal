const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  poster: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  sports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport'
  }],
  country: {
    type: String,
    required: true,
    trim: true
  },
  hide: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;