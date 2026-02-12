const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  checkpoint: {
    type: String,
    enum: ['entrance checkin', 'sports checkin', 'checkout'],
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  scannedAt: {
    type: Date,
    default: Date.now
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  }
}, {
  versionKey: false
});

schema.pre('save', function(next) {
  next();
});

const StudentAttendance = mongoose.model('StudentAttendance', schema);

module.exports = StudentAttendance;