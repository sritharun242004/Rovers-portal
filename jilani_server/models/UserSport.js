const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  versionKey: false
});

// Compound index to ensure a sport can't be added to the same user multiple times
schema.index({ user: 1, sport: 1 }, { unique: true });

const UserSport = mongoose.model('UserSport', schema);

module.exports = UserSport;