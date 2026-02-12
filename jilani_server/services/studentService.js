const Student = require('../models/Student');
const Registration = require('../models/Registration');
const StudentAttendance = require('../models/StudentAttendance');

class StudentService {
  static async list(filters = {}) {
    try {
      // Check if this is for attendance tracking (has status filter) or general student listing
      if (filters.status) {
        // Original attendance-based logic for status filtering
        let attendanceQuery = StudentAttendance.find();
        attendanceQuery = attendanceQuery.where('checkpoint').equals(filters.status);

        const attendanceRecords = await attendanceQuery
          .populate('student')
          .populate({
            path: 'student',
            populate: {
              path: 'sport',
              select: 'name'
            }
          })
          .exec();

        // Get all student IDs from attendance records
        const studentIds = attendanceRecords.map(record => record.student._id);

        // Get non-rejected registrations for these students
        const registrations = await Registration.find({
          student: { $in: studentIds },
          status: { $ne: 'rejected' }
        }).populate('sport', 'name');

        // Create a map of student ID to their registration
        const registrationMap = registrations.reduce((map, reg) => {
          map[reg.student.toString()] = reg;
          return map;
        }, {});

        // Map attendance records to student data
        return attendanceRecords.map(record => {
          const student = record.student;
          const registration = registrationMap[student._id.toString()];
          
          return {
            _id: student._id,
            name: student.name || '',
            uid: student.uid || '',
            sport: registration?.sport?.name || student.sport?.name || '',
            location: student.location || 'Not specified',
            status: record.checkpoint,
            photo: student.photo || '',
            dob: student.dob || null,
            gender: student.gender || '',
            nationality: student.nationality || '',
            nationalityCode: student.nationalityCode || '',
            city: student.city || '',
            idProof: student.idProof || '',
            inlineCategory: student.inlineCategory || '',
            represents: student.represents || '',
            class: student.class || '',
            bloodGroup: student.bloodGroup || 'Unknown',
            medicalConditions: student.medicalConditions || '',
            scannedAt: record.scannedAt
          };
        });
      } else {
        // New logic for general student listing with registration status
        let query = Student.find();
        
        // Apply search filter if provided
        if (filters.search) {
          const searchRegex = new RegExp(filters.search, 'i');
          query = query.where({
            $or: [
              { name: searchRegex },
              { uid: searchRegex },
              { location: searchRegex }
            ]
          });
        }

        // Get all students
        const students = await query
          .populate('sport', 'name')
          .lean()
          .exec();

        // Get all non-rejected registrations for these students (pending and approved count as registered)
        const studentIds = students.map(student => student._id);
        const registrations = await Registration.find({
          student: { $in: studentIds },
          status: { $ne: 'rejected' }
        }).populate('sport', 'name').lean();

        // Create a map of student ID to their registrations
        const registrationMap = registrations.reduce((map, reg) => {
          if (!map[reg.student.toString()]) {
            map[reg.student.toString()] = [];
          }
          map[reg.student.toString()].push(reg);
          return map;
        }, {});

        // Filter by sport if provided
        let filteredStudents = students;
        if (filters.sport) {
          filteredStudents = students.filter(student => {
            const studentRegistrations = registrationMap[student._id.toString()] || [];
            return studentRegistrations.some(reg => reg.sport._id.toString() === filters.sport.toString());
          });
        }

        // Map students to the expected format with registration status
        return filteredStudents.map(student => {
          const studentRegistrations = registrationMap[student._id.toString()] || [];
          const hasRegistrations = studentRegistrations.length > 0;
          const primarySport = studentRegistrations.length > 0 
            ? studentRegistrations[0].sport.name 
            : (student.sport?.name || 'Not registered');

          return {
            _id: student._id,
            name: student.name || '',
            uid: student.uid || '',
            sport: primarySport,
            location: student.location || 'Not specified',
            status: hasRegistrations ? 'registered' : 'not registered',
            isRegistered: hasRegistrations,
            registrationCount: studentRegistrations.length,
            photo: student.photo || '',
            dob: student.dob || null,
            gender: student.gender || '',
            nationality: student.nationality || '',
            nationalityCode: student.nationalityCode || '',
            city: student.city || '',
            idProof: student.idProof || '',
            inlineCategory: student.inlineCategory || '',
            represents: student.represents || '',
            class: student.class || '',
            bloodGroup: student.bloodGroup || 'Unknown',
            medicalConditions: student.medicalConditions || ''
          };
        });
      }
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}\n${error.stack}`);
    }
  }
}

module.exports = StudentService;