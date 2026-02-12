const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  relationship: {
    type: String,
    enum: ['father', 'mother', 'guardian', 'parent', 'coach', 'other'],
    default: 'parent'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  versionKey: false
});

// Compound index to ensure a student can't be added to the same parent multiple times
schema.index({ parent: 1, student: 1 }, { unique: true });

const ParentStudent = mongoose.model('ParentStudent', schema);

module.exports = ParentStudent;