const { default: mongoose } = require('mongoose');
const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');
const StatisticsService = require('../services/statisticsService');

class AttendanceService {
  static async verifyAndRecordAttendance({ studentId, checkpoint, location, volunteerId }) {
    try {
      // Validate the studentId format first
      if (!studentId || typeof studentId !== 'string') {
        throw new Error('Invalid QR code format');
      }
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error(`Invalid student ID format: ${studentId}`);
      }

      // Get the student
      const student = await Student.findById(studentId);
      if (!student) {
        throw new Error(`Student with ID ${studentId} not found. Please scan a valid student QR code.`);
      }

      const existingAttendance = await StudentAttendance.findOne({
        student: student._id,
        checkpoint,
        // Add date range check for today's date
        scannedAt: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      });

      if (existingAttendance) {
        return {
          success: true,
          student: {
            name: student.name,
            id: student._id
          },
          message: `Attendance already marked for ${student.name}`
        };
      }

      // Validate and process location data
      let processedLocation = { latitude: 0, longitude: 0 };
      let locationStatus = 'default';

      if (location) {
        // Validate location coordinates
        if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
          // Check if coordinates are valid (not 0,0 and within reasonable bounds)
          if (location.latitude !== 0 || location.longitude !== 0) {
            if (Math.abs(location.latitude) <= 90 && Math.abs(location.longitude) <= 180) {
              processedLocation = {
                latitude: location.latitude,
                longitude: location.longitude
              };
              locationStatus = 'valid';
              console.log(`Valid location captured for student ${student.name}:`, processedLocation);
            } else {
              console.warn(`Invalid coordinates received for student ${student.name}:`, location);
              locationStatus = 'invalid_coordinates';
            }
          } else {
            console.warn(`Zero coordinates received for student ${student.name}. This may indicate a geolocation failure.`);
            locationStatus = 'zero_coordinates';
          }
        } else {
          console.warn(`Invalid location data type for student ${student.name}:`, location);
          locationStatus = 'invalid_type';
        }
      } else {
        console.warn(`No location data provided for student ${student.name}`);
        locationStatus = 'missing';
      }

      // Create attendance record
      const attendance = new StudentAttendance({
        student: student._id,
        checkpoint,
        location: processedLocation,
        scannedBy: volunteerId
      });

      await attendance.save();
      console.log(`Attendance recorded for student ${student.name} at checkpoint ${checkpoint} with location status: ${locationStatus}`);

      // Update student status based on checkpoint
      student.status = checkpoint;
      await student.save();
      console.log(`Student status updated to ${checkpoint} for ${student.name}`);

      // Emit statistics update via WebSocket
      if (global.io) {
        try {
          const stats = await StatisticsService.getAttendanceStats();
          global.io.emit('statistics-update', stats);
          console.log('Statistics update emitted via WebSocket');
        } catch (error) {
          console.error('Error emitting statistics update:', error);
        }
      } else {
        console.log('Socket.IO not initialized, statistics update not emitted');
      }

      return {
        success: true,
        student: {
          name: student.name,
          id: student._id
        },
        locationStatus: locationStatus
      };
    } catch (error) {
      console.error('Error in verifyAndRecordAttendance:', {
        error: error.message,
        stack: error.stack,
        params: {
          studentId,
          checkpoint,
          volunteerId,
          locationProvided: !!location
        }
      });
      throw error;
    }
  }
}

module.exports = AttendanceService;