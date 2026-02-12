const mongoose = require('mongoose');

const sportSubTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  }
}, {
  versionKey: false,
  timestamps: true
});

// Creating a compound index to ensure uniqueness of type within a sport
sportSubTypeSchema.index({ type: 1, sport: 1 }, { unique: true });

const SportSubType = mongoose.model('SportSubType', sportSubTypeSchema);

module.exports = SportSubType;