const User = require('../models/User');
const Student = require('../models/Student');
const ParentStudent = require('../models/ParentStudent');
const Registration = require('../models/Registration');
const mongoose = require('mongoose');

class ParentService {
  /**
   * Get children for a parent
   * @param {string} parentId - The ID of the parent user
   * @param {Object} options - Pagination and search options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {string} options.search - Search query
   * @param {number} options.skip - Number of items to skip
   * @returns {Promise<Array>} - The children associated with the parent
   */
  static async getChildren(parentId, options = {}) {
    try {
      const findUser = await User.findById(parentId).lean();
      let query = {};
      
      // Build search query if provided
      if (options.search) {
        const searchRegex = new RegExp(options.search, 'i');
        // First find the students that match the name
        const matchingStudents = await Student.find({ name: searchRegex }).select('_id');
        const studentIds = matchingStudents.map(student => student._id);
        
        // Then find the parent-student relationships for these students
        query = {
          student: { $in: studentIds }
        };
      }

      // Add parent/school filter
      if (findUser.role === 'parent') {
        query.parent = parentId;
      } else {
        query.school = parentId;
      }

      console.log('Search query:', JSON.stringify(query, null, 2));

      const relationships = await ParentStudent.find(query)
        .populate({
          path: 'student',
          populate: {
            path: 'sport',
            select: 'name'
          }
        })
        .skip(options.skip || 0)
        .limit(options.limit || 10)
        .lean();

      console.log('Found relationships:', relationships.length);

      // Get all student IDs to check registration status
      const studentIds = relationships.map(rel => rel.student._id);
      
      // Get all non-rejected registrations for these students (pending and approved count as registered)
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

      // Map the populated student documents to the return format
      const children = relationships.map(rel => {
        const student = rel.student;
        const studentRegistrations = registrationMap[student._id.toString()] || [];
        const hasRegistrations = studentRegistrations.length > 0;
        
        return {
          _id: student._id,
          name: student.name,
          uid: student.uid,
          sport: student.sport?.name || 'Not assigned',
          location: student.location || '',
          status: student.status || 'not visited',
          photo: student.photo || '',
          dob: student.dob || null,
          gender: student.gender || '',
          nationality: student.nationality || '',
          city: student.city || '',
          represents: student.represents || '',
          class: student.class || '',
          bloodGroup: student.bloodGroup || 'Unknown',
          relationship: rel.relationship || 'parent',
          isRegistered: hasRegistrations,
          registrationCount: studentRegistrations.length
        };
      });

      return children;
    } catch (error) {
      console.error(`[ParentService] Error getting children: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Get total count of children for a parent
   * @param {string} parentId - The ID of the parent user
   * @param {string} search - Search query
   * @returns {Promise<number>} - Total count of children
   */
  static async getChildrenCount(parentId, search = '') {
    try {
      const findUser = await User.findById(parentId).lean();
      let query = {};
      
      // Build search query if provided
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        // First find the students that match the name
        const matchingStudents = await Student.find({ name: searchRegex }).select('_id');
        const studentIds = matchingStudents.map(student => student._id);
        
        // Then find the parent-student relationships for these students
        query = {
          student: { $in: studentIds }
        };
      }

      // Add parent/school filter
      if (findUser.role === 'parent') {
        query.parent = parentId;
      } else {
        query.school = parentId;
      }

      console.log('Count query:', JSON.stringify(query, null, 2));
      const count = await ParentStudent.countDocuments(query);
      console.log('Count result:', count);

      return count;
    } catch (error) {
      console.error(`[ParentService] Error getting children count: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Link a child to a parent
   * @param {string} parentId - The ID of the parent user
   * @param {string} studentUid - The UID of the student
   * @param {string} relationship - The relationship type (father, mother, guardian, other)
   * @returns {Promise<Object>} - The result of the operation
   */
  static async linkChild(parentId, studentUid, relationship = 'parent') {
    try {
      console.log(`[ParentService] Linking student with UID ${studentUid} to parent ${parentId}`);

      // Find the student by UID
      const student = await Student.findOne({ uid: studentUid });
      if (!student) {
        throw new Error(`Student with UID ${studentUid} not found`);
      }

      // Check if relationship already exists
      const existingRelationship = await ParentStudent.findOne({
        parent: parentId,
        student: student._id
      });

      if (existingRelationship) {
        throw new Error('This student is already linked to your account');
      }

      // Create the relationship
      const parentStudent = new ParentStudent({
        parent: parentId,
        student: student._id,
        relationship: relationship || 'parent'
      });

      await parentStudent.save();
      console.log(`[ParentService] Student linked successfully: ${student._id}`);

      return {
        success: true,
        student: student
      };
    } catch (error) {
      console.error(`[ParentService] Error linking child: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Add a new student
   * @param {string} parentId - The ID of the parent user
   * @param {Object} studentData - The student data
   * @returns {Promise<Object>} - The created student
   */
  static async addStudent(parentId, studentData) {
    try {
      console.log(`[ParentService] Adding student for parent: ${parentId}`);

      // Create the student
      const student = new Student(studentData);
      await student.save();
      console.log(`[ParentService] Student created with ID: ${student._id}`);

      // Link student to parent
      const parentStudent = new ParentStudent({
        parent: parentId,
        student: student._id,
        relationship: studentData.relationship || 'parent'
      });

      await parentStudent.save();
      console.log(`[ParentService] Student linked to parent with relationship: ${parentStudent.relationship}`);

      return {
        success: true,
        student: student
      };
    } catch (error) {
      console.error(`[ParentService] Error adding student: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Submit a query
   * @param {string} parentId - The ID of the parent user
   * @param {string|null} studentId - The ID of the student (can be null for general queries)
   * @param {string} subject - The query subject
   * @param {string} message - The query message
   * @returns {Promise<Object>} - The created query
   */
  static async submitQuery(parentId, studentId, subject, message) {
    try {
      console.log(`[ParentService] Submitting query${studentId ? ` for student ${studentId}` : ' (general)'} by parent ${parentId}`);

      // Create the query object with required fields
      const queryData = {
        user: parentId,   // Add the user field with parentId
        parent: parentId,
        subject,
        message,
        status: 'pending'
      };

      // Only add student field if studentId is provided and it's a valid ObjectId
      if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
        queryData.student = studentId;
      }

      // Create the query
      const Query = require('../models/Query');
      const query = new Query(queryData);

      await query.save();
      console.log(`[ParentService] Query submitted with ID: ${query._id}`);

      return query;
    } catch (error) {
      console.error(`[ParentService] Error submitting query: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Update student photo
   * @param {string} parentId - The ID of the parent user
   * @param {string} studentId - The ID of the student
   * @param {string} photoUrl - The URL of the photo
   * @returns {Promise<Object>} - The updated student
   */
  static async updateStudentPhoto(parentId, studentId, photoUrl) {
    try {
      console.log(`[ParentService] Updating photo for student ${studentId}`);

      // Verify parent has relationship with student
      const relationship = await ParentStudent.findOne({
        parent: parentId,
        student: studentId
      });

      if (!relationship) {
        throw new Error('You do not have permission to update this student');
      }

      // Update student photo
      const student = await Student.findById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      student.photo = photoUrl;
      await student.save();
      console.log(`[ParentService] Student photo updated successfully`);

      return student;
    } catch (error) {
      console.error(`[ParentService] Error updating student photo: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Get queries for a parent
   * @param {string} parentId - The ID of the parent user
   * @returns {Promise<Array>} - The queries submitted by the parent
   */
  static async getQueries(parentId) {
    try {
      console.log(`[ParentService] Getting queries for parent: ${parentId}`);

      const Query = require('../models/Query');
      const queries = await Query.find({ user: parentId })
        .populate('student', 'name uid')
        .sort({ createdAt: -1 })
        .lean();

      console.log(`[ParentService] Found ${queries.length} queries`);
      return queries;
    } catch (error) {
      console.error(`[ParentService] Error getting queries: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Update student information
   * @param {string} parentId - The ID of the parent user
   * @param {string} studentId - The ID of the student
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} - The updated student
   */
  static async updateStudent(parentId, studentId, updateData) {
    try {
      console.log(`[ParentService] Updating student ${studentId} by parent ${parentId}`);

      // Verify parent has relationship with student
      const relationship = await ParentStudent.findOne({
        parent: parentId,
        student: studentId
      });

      if (!relationship) {
        throw new Error('You do not have permission to update this student');
      }

      // Update student
      const student = await Student.findByIdAndUpdate(
        studentId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!student) {
        throw new Error('Student not found');
      }

      console.log(`[ParentService] Student updated successfully`);
      return { student };
    } catch (error) {
      console.error(`[ParentService] Error updating student: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Get a student by ID
   * @param {string} parentId - The ID of the parent user
   * @param {string} studentId - The ID of the student
   * @returns {Promise<Object>} - The student details
   */
  static async getStudentById(parentId, studentId) {
    try {
      console.log(`[ParentService] Getting student ${studentId} for parent ${parentId}`);

      // Check if parent has access to this student
      const relationship = await ParentStudent.findOne({
        parent: parentId,
        student: studentId
      });

      // if (!relationship) {
      //   throw new Error('Student not found or you do not have permission to view this student');
      // }

      // Fetch the student with populated fields
      const student = await Student.findById(studentId)
        .populate('sport', 'name')
        .populate('ageCategory', 'ageGroup')
        .populate('distance', 'category value unit')
        .populate('sportSubType', 'type')
        .lean();

      if (!student) {
        throw new Error('Student not found');
      }

      // Add relationship from parent-student table
      student.relationship = relationship.relationship;

      return student;
    } catch (error) {
      console.error(`[ParentService] Error getting student by ID: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }
}

module.exports = ParentService;