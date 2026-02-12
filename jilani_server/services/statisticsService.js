const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');
const Sport = require('../models/Sport');

class StatisticsService {
  static async getAttendanceStats() {
    try {
      // Get total registered students
      const totalRegistered = await Student.countDocuments();

      // Get entrance checkins
      const entranceCount = await StudentAttendance.countDocuments({
        checkpoint: 'entrance checkin'
      });

      // Get sports checkins
      const sportsCount = await StudentAttendance.countDocuments({
        checkpoint: 'sports checkin'
      });

      // Get checkouts
      const exitCount = await StudentAttendance.countDocuments({
        checkpoint: 'checkout'
      });

      // Get sport breakdown
      const sports = await Sport.find();
      const sportBreakdown = {
        entrance: [],
        sports: [],
        exit: []
      };

      for (const sport of sports) {
        const students = await Student.find({ sport: sport._id });
        const studentIds = students.map(s => s._id);

        const entranceCheckins = await StudentAttendance.countDocuments({
          student: { $in: studentIds },
          checkpoint: 'entrance checkin'
        });

        const sportsCheckins = await StudentAttendance.countDocuments({
          student: { $in: studentIds },
          checkpoint: 'sports checkin'
        });

        const checkouts = await StudentAttendance.countDocuments({
          student: { $in: studentIds },
          checkpoint: 'checkout'
        });

        sportBreakdown.entrance.push({ sport: sport.name, count: entranceCheckins });
        sportBreakdown.sports.push({ sport: sport.name, count: sportsCheckins });
        sportBreakdown.exit.push({ sport: sport.name, count: checkouts });
      }

      return {
        totalRegistered,
        entranceCount,
        sportsCount,
        exitCount,
        sportBreakdown
      };
    } catch (error) {
      console.error('Error getting attendance stats:', error);
      throw error;
    }
  }
}

module.exports = StatisticsService;