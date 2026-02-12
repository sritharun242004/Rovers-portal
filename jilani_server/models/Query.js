const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: false
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  response: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

const Query = mongoose.model('Query', schema);

module.exports = Query;