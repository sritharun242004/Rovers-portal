const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

// Create a compound index on sport and question for performance
faqSchema.index({ sport: 1, question: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;