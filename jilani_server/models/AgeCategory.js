const mongoose = require('mongoose');

const ageCategorySchema = new mongoose.Schema({
  ageGroup: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  }
}, {
  versionKey: false,
  timestamps: true
});

const AgeCategory = mongoose.model('AgeCategory', ageCategorySchema);

module.exports = AgeCategory;