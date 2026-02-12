const mongoose = require('mongoose');

const distanceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'meters'
  }
}, {
  versionKey: false,
  timestamps: true
});

const Distance = mongoose.model('Distance', distanceSchema);

module.exports = Distance;