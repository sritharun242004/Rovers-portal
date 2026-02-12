const mongoose = require('mongoose');

const eventSportSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
});

// Create a compound index to ensure unique event-sport pairs
eventSportSchema.index({ event: 1, sport: 1 }, { unique: true });

const EventSport = mongoose.model('EventSport', eventSportSchema);

module.exports = EventSport;