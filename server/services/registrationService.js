const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Student = require('../models/Student');
const User = require('../models/User');
const AgeCategory = require('../models/AgeCategory');
const Event = require('../models/Event');
const Sport = require('../models/Sport');
const Registration = require('../models/Registration');
const ParentStudent = require('../models/ParentStudent');
const Distance = require('../models/Distance');
const SportSubType = require('../models/SportSubType');
const EmailService = require('../utils/email');

class RegistrationService {
  // Register a student for a sport
  static async registerStudentForSport(parentId, registrationData) {
    try {
      const { studentId, studentIds, sportId, eventId, ageCategoryId, distanceId, sportSubTypeId, isGroupSport, paymentScreenshot, transactionId, schoolId, registrationType } = registrationData;
      console.log('Registration data received:', registrationData);

      // Get the sport details
      const sport = await Sport.findById(sportId);
      if (!sport) {
        throw new Error('Sport not found');
      }

      // Check if this is actually a group sport based on the sport name
      const isTeamSport = ['Cricket', 'Football'].includes(sport.name);

      // Process and validate substitutes
      let substitutes = [];
      if (registrationData.substitutes) {
        // Convert to array if it's not already
        substitutes = Array.isArray(registrationData.substitutes)
          ? registrationData.substitutes
          : [registrationData.substitutes];

        console.log('Substitutes received:', substitutes);

        // Validate that there are at most 2 substitutes
        if (substitutes.length > 2) {
          throw new Error('Maximum of 2 substitutes allowed per team');
        }
      }

      // Generate a unique group registration ID for team sports with multiple students
      let groupRegistrationId = null;
      if (isTeamSport && (studentIds?.length > 1 || isGroupSport)) {
        // Generate a unique ID for this group registration
        groupRegistrationId = `TEAM-${sport.name.substring(0, 3).toUpperCase()}-${uuidv4().substring(0, 8)}`;
        console.log(`Generated group registration ID: ${groupRegistrationId} for team sport ${sport.name}`);
      }

      // Get the parent details
      const parent = await User.findById(parentId);
      if (!parent) {
        throw new Error('Parent not found');
      }

      // Get the event details if eventId is provided
      let event = null;
      if (eventId) {
        event = await Event.findById(eventId);
        if (!event) {
          throw new Error('Event not found');
        }
      }

      // Get the age category details if ageCategoryId is provided
      let ageCategory = null;
      if (ageCategoryId) {
        ageCategory = await AgeCategory.findById(ageCategoryId);
        if (!ageCategory) {
          throw new Error('Age category not found');
        }
      }

      // Get the distance details if distanceId is provided
      let distance = null;
      if (distanceId) {
        distance = await Distance.findById(distanceId);
        if (!distance) {
          throw new Error('Distance not found');
        }
      }

      // Get the sport subtype details if sportSubTypeId is provided
      let sportSubType = null;
      if (sportSubTypeId) {
        sportSubType = await SportSubType.findById(sportSubTypeId);
        if (!sportSubType) {
          throw new Error('Sport subtype not found');
        }
      }

      // Handle multiple student registrations for school users
      let students = [];
      if (isGroupSport || parent.role === 'school' || registrationType === 'school') {
        // For group sports or school users, use studentIds array
        if (!studentIds) {
          throw new Error('No students selected');
        }
        console.log('Student IDs for registration:', studentIds);
        students = await Student.find({ _id: { $in: studentIds } });
      } else {
        // For individual sports with parent users, use single studentId
        const student = await Student.findById(studentIds);
        if (!student) {
          throw new Error('Student not found');
        }
        students = [student];
      }

      // Check if any of the students are already registered for this sport
      const existingRegistrations = await Registration.find({
        student: { $in: students.map(s => s._id) },
        sport: sportId,
        event: eventId || { $exists: false }
      });

      if (existingRegistrations.length > 0) {
        const registeredStudents = existingRegistrations.map(reg => reg.student);
        const duplicateStudents = students.filter(s => registeredStudents.includes(s._id));
        throw new Error(`The following students are already registered: ${duplicateStudents.map(s => s.name).join(', ')}`);
      }

      // Create registrations for all selected students
      const findUser = await User.findById(parentId);
      let registrations;

      // Helper function to format dates
      const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      // Handle registration based on type
      if (registrationType === 'school' || parent.role === 'school') {
        // School registration
        registrations = await Promise.all(students.map(async (student) => {
          const isSubstitute = substitutes.includes(student._id.toString());
          console.log(`Student ${student.name} (${student._id}) isSubstitute: ${isSubstitute}`);

          const parentStudent = await ParentStudent.findOne({ student: student._id });
          if (!parentStudent) {
            throw new Error(`No parent found for student ${student.name}`);
          }

          const registration = new Registration({
            event: eventId,
            student: student._id,
            school: schoolId || parentId,
            parent: parentStudent.parent,
            sport: sportId,
            ageCategory: ageCategoryId,
            distance: distanceId,
            sportSubType: sportSubTypeId,
            isGroupRegistration: !!groupRegistrationId,
            groupRegistrationId: groupRegistrationId,
            isSubstitute: isSubstitute,
            paymentScreenshot,
            transactionId,
            status: 'pending',
            // Payment-related fields
            paymentStatus: registrationData.paymentStatus || 'pending',
            paymentMethod: registrationData.paymentMethod || 'manual',
            paymentIntentId: registrationData.paymentIntentId,
            paymentAmount: registrationData.paymentAmount,
            paymentCurrency: registrationData.paymentCurrency,
            country: registrationData.country,
            includeCertification: registrationData.includeCertification || false,
            registrationType: registrationData.registrationType || 'manual'
          });
          await registration.save();

          // Send email to school admin
          if (findUser.email) {
            let additionalDetails = '';
            if (event) {
              additionalDetails += `<p><strong>Event:</strong> ${event.name}</p>`;
            }
            if (ageCategory) {
              additionalDetails += `<p><strong>Age Category:</strong> ${ageCategory.ageGroup}</p>`;
            }
            if (distance) {
              additionalDetails += `<p><strong>Distance:</strong> ${distance.value}</p>`;
            }
            if (sportSubType) {
              additionalDetails += `<p><strong>Sport Type:</strong> ${sportSubType.type}</p>`;
            }

            const schoolEmailContent = `
              <div style="font-family: Arial, sans-serif;">
                <h2>Registration Successful!</h2>
                <p>Student ${student.name} has been registered successfully for the following sport:</p>
                <p><strong>Sport Name:</strong> ${sport.name}</p>
                <p><strong>Start Date:</strong> ${formatDate(sport.startDate)}</p>
                <p><strong>End Date:</strong> ${formatDate(sport.endDate)}</p>
                <p><strong>Sport Location:</strong> ${sport.location || 'TBD'}</p>
                <p><strong>Sport Address:</strong> ${sport.address || 'TBD'}</p>
                ${additionalDetails}
                
                <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="color: #2e7d32; margin-top: 0;">What's Next?</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    <li>You will receive further instructions via email closer to the event date</li>
                    <li>Please ensure students arrive 30 minutes before their scheduled time</li>
                    <li>Bring a valid ID and any required sports equipment</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                  <a href="https://rovers.life/login" style="display: inline-block; background-color: #2961b6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    📋 View Registration Details
                  </a>
                </div>
                
                <p>If you have any questions, feel free to contact us.</p>
                <p>Please ensure the participant's details are up-to-date for generating ID cards.</p>
                <hr style="margin: 20px 0;">
                <p style="font-size: 0.95em; color: #555;">
                  <em>Note:</em> Registration is subject to confirmation after payment details are verified. In case of discrepancies, Team Rovers retains the right to reject your application.
                </p>
              </div>
            `;

            try {
              await EmailService.sendEmail(
                findUser.email,
                'Student Sport Registration Confirmation',
                "Students have been successfully registered for the sport!",
                schoolEmailContent
              );
            } catch (emailError) {
              console.error('Error sending school registration email:', emailError);
            }

            // If we have the parent's email, send them a notification too
            if (parentStudent?.parent) {
              const parentUser = await User.findById(parentStudent.parent);
              if (parentUser?.email) {
                try {
                  await EmailService.sendEmail(
                    parentUser.email,
                    'Your Child\'s Sport Registration Confirmation',
                    "Your child has been registered for a sport by their school",
                    schoolEmailContent.replace('Student ', 'Your child ')
                  );
                } catch (parentEmailError) {
                  console.error('Error sending parent notification email:', parentEmailError);
                }
              }
            }
          }

          return registration;
        }));
      } else {
        // Self registration
        registrations = await Promise.all(students.map(async (student) => {
          const isSubstitute = substitutes.includes(student._id.toString());
          console.log(`Student ${student.name} (${student._id}) isSubstitute: ${isSubstitute}`);

          const registration = new Registration({
            event: eventId,
            student: student._id,
            parent: parentId,
            school: null,
            sport: sportId,
            ageCategory: ageCategoryId,
            distance: distanceId,
            sportSubType: sportSubTypeId,
            isGroupRegistration: !!groupRegistrationId,
            groupRegistrationId: groupRegistrationId,
            isSubstitute: isSubstitute,
            paymentScreenshot,
            transactionId,
            status: 'pending',
            // Payment-related fields
            paymentStatus: registrationData.paymentStatus || 'pending',
            paymentMethod: registrationData.paymentMethod || 'manual',
            paymentIntentId: registrationData.paymentIntentId,
            paymentAmount: registrationData.paymentAmount,
            paymentCurrency: registrationData.paymentCurrency,
            country: registrationData.country,
            includeCertification: registrationData.includeCertification || false,
            registrationType: registrationData.registrationType || 'manual'
          });
          await registration.save();

          // Send confirmation email to the parent
          if (parent.email) {
            let additionalDetails = '';
            if (event) {
              additionalDetails += `<p><strong>Event:</strong> ${event.name}</p>`;
            }
            if (ageCategory) {
              additionalDetails += `<p><strong>Age Category:</strong> ${ageCategory.ageGroup}</p>`;
            }
            if (distance) {
              additionalDetails += `<p><strong>Distance:</strong> ${distance.value}</p>`;
            }
            if (sportSubType) {
              additionalDetails += `<p><strong>Sport Type:</strong> ${sportSubType.type}</p>`;
            }

            const emailContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #2961b6; color: white; padding: 20px; text-align: center;">
                  <h2>Registration Successful!</h2>
                </div>
                
                <div style="padding: 20px;">
                  <p>Dear ${parent.name},</p>
                  <p>Your child ${student.name} has been registered successfully for the following sport:</p>
                  
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <p><strong>Sport Name:</strong> ${sport.name}</p>
                    <p><strong>Start Date:</strong> ${formatDate(sport.startDate)}</p>
                    <p><strong>End Date:</strong> ${formatDate(sport.endDate)}</p>
                    <p><strong>Sport Location:</strong> ${sport.location || 'TBD'}</p>
                    <p><strong>Sport Address:</strong> ${sport.address || 'TBD'}</p>
                    ${additionalDetails}
                  </div>
                  
                  <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #2e7d32; margin-top: 0;">What's Next?</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                      <li>You will receive further instructions via email closer to the event date</li>
                      <li>Please ensure your child arrives 30 minutes before their scheduled time</li>
                      <li>Bring a valid ID and any required sports equipment</li>
                    </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://rovers.life/login" style="display: inline-block; background-color: #2961b6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      📋 View Registration Details
                    </a>
                  </div>
                  
                  <p>Please ensure your child's details are up-to-date for generating ID cards.</p>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                    <p>If you have any questions, please contact our support team.</p>
                    <p><em>Note:</em> Registration is subject to confirmation after payment details are verified. In case of discrepancies, Team Rovers retains the right to reject your application.</p>
                  </div>
                </div>
              </div>
            `;

            try {
              await EmailService.sendEmail(
                parent.email,
                'Student Registration Confirmation',
                "Your child has been successfully registered for the sport!",
                emailContent
              );
              console.log(`Registration confirmation email sent to: ${parent.email}`);
            } catch (emailError) {
              console.error('Error sending registration email:', emailError);
            }
          }

          return registration;
        }));
      }

      return {
        registrations,
        studentCount: students.length,
        groupRegistrationId: groupRegistrationId
      };
    } catch (error) {
      console.error('Error in registerStudentForSport:', error);
      throw error;
    }
  }

  // Get eligible age categories for a student and sport
  static async getEligibleAgeCategories(studentId, sportId) {
    try {
      // Get the student
      const student = await Student.findById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      // Get the sport
      const sport = await Sport.findById(sportId);
      if (!sport) {
        throw new Error('Sport not found');
      }

      // Get all age categories for the sport
      const ageCategories = await AgeCategory.find({}).lean();

      // Calculate student's age based on DOB
      const dob = new Date(student.dob);
      const sportStartDate = sport.startDate ? new Date(sport.startDate) : new Date();

      // Calculate age at the time of sport event
      const ageAtEvent = sportStartDate.getFullYear() - dob.getFullYear();

      // For each age category, determine if the student is eligible
      const eligibleCategories = ageCategories.map(category => {
        // Parse the age from the category (e.g., "Under 17" -> 17)
        const ageLimit = parseInt(category.ageGroup.replace(/\D/g, ''), 10);
        const isEligible = ageAtEvent < ageLimit;

        return {
          ...category,
          isEligible
        };
      });

      return eligibleCategories;
    } catch (error) {
      console.error('Error getting eligible age categories:', error);
      throw new Error(`Failed to get eligible age categories: ${error.message}`);
    }
  }

  /**
   * Get all registrations for a specific parent with populated fields
   * @param {string} parentId - ID of the parent
   * @returns {Promise<Array>} - List of registrations with populated fields
   */
  static async getParentRegistrations(parentId) {
    try {
      const findUser = await User.findById(parentId);
      let allRegistrations;

      // Query based on user role (parent or school)
      if (findUser.role === 'parent') {
        allRegistrations = await Registration.find({ parent: parentId })
          .populate({
            path: 'student',
            select: 'name photo uid dob gender'
          })
          .populate({
            path: 'sport',
            select: 'name startDate endDate location address'
          })
          .populate({
            path: 'event',
            select: 'name'
          })
          .populate({
            path: 'ageCategory',
            select: 'ageGroup'
          })
          .populate({
            path: 'distance',
            select: 'category'
          })
          .populate({
            path: 'sportSubType',
            select: 'type'
          })
          .sort({ createdAt: -1 });
      } else {
        allRegistrations = await Registration.find({ school: parentId })
          .populate({
            path: 'student',
            select: 'name photo uid dob gender'
          })
          .populate({
            path: 'sport',
            select: 'name startDate endDate location address'
          })
          .populate({
            path: 'event',
            select: 'name'
          })
          .populate({
            path: 'ageCategory',
            select: 'ageGroup'
          })
          .populate({
            path: 'distance',
            select: 'category'
          })
          .populate({
            path: 'sportSubType',
            select: 'type'
          })
          .sort({ createdAt: -1 });
      }

      console.log(`Found ${allRegistrations.length} registrations for parent ${parentId}`);

      // Group registrations by groupRegistrationId if they have one
      const groupedRegistrations = [];
      const groupMap = new Map();

      // Process all registrations
      for (const registration of allRegistrations) {
        // If it's not a group registration or doesn't have a groupRegistrationId, add it directly
        if (!registration.isGroupRegistration || !registration.groupRegistrationId) {
          groupedRegistrations.push(registration);
          continue;
        }

        // For group registrations, only add the first one we encounter to the results
        if (!groupMap.has(registration.groupRegistrationId)) {
          groupMap.set(registration.groupRegistrationId, true);
          groupedRegistrations.push(registration);
        }
      }

      return groupedRegistrations;
    } catch (error) {
      console.error('Error fetching parent registrations:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  // Get registrations for a parent
  static async getRegistrationsForParent(parentId) {
    try {
      console.log(`Fetching registrations for parent: ${parentId}`);
      console.log('Querying Registration collection with filter:', { parent: parentId });

      const registrations = await Registration.find({ parent: parentId })
        .populate('student', 'name photo uid')
        .populate('sport', 'name')
        .populate('event', 'name')
        .populate('ageCategory', 'ageGroup')
        .populate('distance', 'category')
        .populate('sportSubType', 'type')
        .sort({ createdAt: -1 })
        .lean();

      console.log(`Found ${registrations.length} registrations for parent ${parentId}`);
      if (registrations.length > 0) {
        console.log('Sample registration data (first record):', JSON.stringify(registrations[0]));
      } else {
        console.log('No registrations found');
      }

      return registrations;
    } catch (error) {
      console.error('Error getting registrations for parent:', error);
      console.error('Stack trace:', error.stack);
      throw new Error(`Failed to get registrations: ${error.message}`);
    }
  }

  // Get students eligible for registration based on sport and age category
  static async getEligibleStudentsForRegistration(parentId, sportId, ageCategoryId) {
    try {
      console.log('=== GET ELIGIBLE STUDENTS FOR REGISTRATION ===');
      console.log('Parent ID:', parentId);
      console.log('Sport ID:', sportId);
      console.log('Age Category ID:', ageCategoryId);

      // Get the sport
      const sport = await Sport.findById(sportId);
      if (!sport) {
        throw new Error('Sport not found');
      }

      // Determine if it's a group sport
      const isGroupSport = ['Cricket', 'Football'].includes(sport.name);
      console.log(`Sport ${sport.name} is ${isGroupSport ? 'a group sport' : 'an individual sport'}`);

      const findUser = await User.findById(parentId);
      let parentStudents;
      if (findUser.role === 'parent') {
        parentStudents = await ParentStudent.find({
          parent: parentId
        }).populate({
          path: 'student',
          select: 'name photo uid dob gender'
        });
      } else {
        parentStudents = await ParentStudent.find({
          school: parentId
        }).populate({
          path: 'student',
          select: 'name photo uid dob gender'
        });
      }
      // Get the parent's students
      console.log(`Found ${parentStudents.length} students for parent ${parentId}`);

      // THIS WAS THE PROBLEM: Early return if not enough students for group sport
      // Instead, we'll flag insufficient students but still return the list
      const insufficientStudents = isGroupSport && parentStudents.length < 7;
      if (insufficientStudents) {
        console.log(`Not enough students (${parentStudents.length}) for group sport, but still returning available students`);
        // We'll handle this in the frontend
      }

      let eligibleStudents = parentStudents.map(ps => ps.student);
      console.log(`Processing ${eligibleStudents.length} students to check eligibility`);

      // If age category is provided, filter students by age
      if (ageCategoryId) {
        const ageCategory = await AgeCategory.findById(ageCategoryId);
        if (!ageCategory) {
          throw new Error('Age category not found');
        }

        // Parse the age limit from the category name (e.g., "Under 7" -> 7)
        const ageLimitMatch = ageCategory.ageGroup.match(/Under\s+(\d+)/i);
        if (!ageLimitMatch) {
          throw new Error(`Unable to parse age limit from category: ${ageCategory.ageGroup}`);
        }

        const ageLimit = parseInt(ageLimitMatch[1], 10);
        console.log(`Age category: ${ageCategory.ageGroup}, Age limit: ${ageLimit}`);

        const sportStartDate = sport.startDate ? new Date(sport.startDate) : new Date();

        // Filter students by age at the time of the sport
        eligibleStudents = eligibleStudents.map(student => {
          const dob = new Date(student.dob);
          const ageAtEvent = sportStartDate.getFullYear() - dob.getFullYear();
          const isEligible = ageAtEvent < ageLimit;

          console.log(`Student ${student.name}: age ${ageAtEvent}, eligible: ${isEligible}`);

          return {
            ...student.toObject(),
            isEligible,
            age: ageAtEvent
          };
        });

        console.log(`Filtered ${eligibleStudents.length} students by age category`);
      } else {
        // If no age category provided, mark all as eligible
        eligibleStudents = eligibleStudents.map(student => ({
          ...student.toObject(),
          isEligible: true
        }));
      }

      // Check if these students are already registered for this sport
      const existingRegistrations = await Registration.find({
        student: { $in: eligibleStudents.map(s => s._id) },
        sport: sportId
      });

      // Filter out students who are already registered
      if (existingRegistrations.length > 0) {
        const registeredIds = existingRegistrations.map(r => r.student.toString());
        console.log(`Found ${registeredIds.length} students already registered for this sport`);
        console.log('Registered student IDs:', registeredIds);

        const beforeCount = eligibleStudents.length;
        eligibleStudents = eligibleStudents.filter(student =>
          !registeredIds.includes(student._id.toString())
        );
        console.log(`Filtered out ${beforeCount - eligibleStudents.length} already registered students`);
        console.log(`${eligibleStudents.length} students remaining for registration`);
      }

      // Return the results with a flag for insufficient students if applicable
      return {
        isGroupSport,
        students: eligibleStudents,
        minRequired: isGroupSport ? 7 : 1,
        insufficientStudents: insufficientStudents
      };
    } catch (error) {
      console.error('Error getting eligible students for registration:', error);
      throw new Error(`Failed to get eligible students: ${error.message}`);
    }
  }

  static async getRegistrationDetails(registrationId, parentId) {
    try {
      console.log(`Fetching detailed registration information for ID: ${registrationId}`);
      console.log(`Parent ID for permission check: ${parentId}`);

      // Find the registration with all necessary populated fields
      const registration = await Registration.findById(registrationId)
        .populate('student', 'name photo uid dob gender')
        .populate({
          path: 'sport',
          select: 'name startDate endDate location address'
        })
        .populate('event', 'name')
        .populate('ageCategory', 'ageGroup')
        .populate('distance', 'category')
        .populate('sportSubType', 'type');

      if (!registration) {
        throw new Error('Registration not found');
      }

      console.log(`Registration parent ID: ${registration.parent}`);
      console.log(`Requesting parent ID: ${parentId}`);

      let participants = [];

      // If this is a group registration, fetch all students in the group
      if (registration.isGroupRegistration && registration.groupRegistrationId) {
        const groupRegistrations = await Registration.find({
          groupRegistrationId: registration.groupRegistrationId
        }).populate('student', 'name photo uid dob gender');

        // Map participants with substitute information
        participants = groupRegistrations.map(reg => ({
          ...reg.student.toObject(),
          isSubstitute: reg.isSubstitute
        }));
      } else {
        participants = [registration.student];
      }

      // Prepare the response with all required details
      return {
        registration,
        participants: participants,
        location: registration.sport?.location || 'Not specified',
        address: registration.sport?.address || 'Not specified',
        paymentScreenshot: registration.paymentScreenshot || null
      };
    } catch (error) {
      console.error('Error fetching registration details:', error);
      throw new Error(`Failed to get registration details: ${error.message}`);
    }
  }

  // Bulk register multiple students for payment confirmations (optimized for performance)
  static async bulkRegisterStudentsForPayment(parentId, registrationData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { studentIds, sportId, eventId, paymentIntentId, paymentStatus, paymentMethod, paymentAmount, paymentCurrency, country, includeCertification, registrationType = 'online_payment' } = registrationData;

      console.log('🚀 Bulk registration started for payment confirmation:', {
        parentId,
        studentCount: studentIds.length,
        sportId,
        eventId,
        paymentIntentId
      });

      // Validate inputs
      if (!Array.isArray(studentIds) || studentIds.length === 0) {
        throw new Error('Student IDs array is required');
      }

      if (!sportId) {
        throw new Error('Sport ID is required');
      }

      // Get sport details
      const sport = await Sport.findById(sportId).session(session);
      if (!sport) {
        throw new Error('Sport not found');
      }

      // Get parent details
      const parent = await User.findById(parentId).session(session);
      if (!parent) {
        throw new Error('Parent not found');
      }

      // Get event details if provided
      let event = null;
      if (eventId) {
        event = await Event.findById(eventId).session(session);
        if (!event) {
          throw new Error('Event not found');
        }
      }

      // Get all students in one query
      const students = await Student.find({ _id: { $in: studentIds } }).session(session);
      if (students.length !== studentIds.length) {
        const foundIds = students.map(s => s._id.toString());
        const missingIds = studentIds.filter(id => !foundIds.includes(id));
        throw new Error(`Students not found: ${missingIds.join(', ')}`);
      }

      // Check for existing registrations in bulk
      const existingRegistrations = await Registration.find({
        student: { $in: studentIds },
        sport: sportId,
        event: eventId || { $exists: false },
        status: { $ne: 'rejected' }
      }).session(session);

      if (existingRegistrations.length > 0) {
        const registeredStudentIds = existingRegistrations.map(reg => reg.student.toString());
        const duplicateStudents = students.filter(s => registeredStudentIds.includes(s._id.toString()));
        throw new Error(`The following students are already registered: ${duplicateStudents.map(s => s.name).join(', ')}`);
      }

      // Get parent-student relationships for all students in bulk
      const parentStudents = await ParentStudent.find({
        student: { $in: studentIds }
      }).session(session);

      const parentStudentMap = parentStudents.reduce((map, ps) => {
        map[ps.student.toString()] = ps;
        return map;
      }, {});

      // Prepare bulk registration documents
      const registrationDocuments = students.map(student => {
        const parentStudent = parentStudentMap[student._id.toString()];
        if (!parentStudent) {
          throw new Error(`No parent found for student ${student.name}. Please ensure the student is properly linked to a parent account.`);
        }

        return {
          event: eventId,
          student: student._id,
          parent: parentStudent.parent,
          sport: sportId,
          status: 'pending',
          paymentStatus: paymentStatus || 'paid',
          paymentMethod: paymentMethod || 'stripe',
          paymentIntentId: paymentIntentId,
          paymentAmount: paymentAmount,
          paymentCurrency: paymentCurrency,
          country: country,
          includeCertification: includeCertification || false,
          registrationType: registrationType,
          transactionId: paymentIntentId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      // Bulk insert registrations
      const registrations = await Registration.insertMany(registrationDocuments, {
        session,
        ordered: false // Continue even if some fail
      });

      console.log(`✅ Bulk registration completed: ${registrations.length} students registered`);

      // Commit the transaction
      await session.commitTransaction();

      // Send emails asynchronously after transaction commits (don't block the response)
      setImmediate(async () => {
        try {
          await this.sendBulkRegistrationEmails({
            registrations,
            students,
            parent,
            sport,
            event,
            includeCertification
          });
        } catch (emailError) {
          console.error('❌ Error sending bulk registration emails:', emailError);
          // Don't throw - emails are not critical for registration success
        }
      });

      return {
        registrations,
        studentCount: registrations.length,
        successCount: registrations.length,
        sport,
        event
      };

    } catch (error) {
      await session.abortTransaction();
      console.error('❌ Error in bulk registration for payment:', {
        message: error.message,
        stack: error.stack,
        registrationData: {
          studentIds: registrationData.studentIds?.length,
          sportId: registrationData.sportId,
          eventId: registrationData.eventId,
          parentId
        }
      });
      throw new Error(`Bulk registration failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  // Helper method to send bulk registration emails efficiently
  static async sendBulkRegistrationEmails({ registrations, students, parent, sport, event, includeCertification }) {
    console.log('📧 Starting bulk email sending for registrations...');

    const formatDate = (date) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Group students by parent to send consolidated emails
    const parentGroups = {};

    for (const registration of registrations) {
      const student = students.find(s => s._id.toString() === registration.student.toString());
      if (!student) continue;

      const parentId = registration.parent.toString();
      if (!parentGroups[parentId]) {
        parentGroups[parentId] = {
          parent: registration.parent,
          students: [],
          registrations: []
        };
      }

      parentGroups[parentId].students.push(student);
      parentGroups[parentId].registrations.push(registration);
    }

    // Send emails to each parent group
    const emailPromises = Object.values(parentGroups).map(async (group) => {
      try {
        // Get parent details
        const parentUser = await User.findById(group.parent);
        if (!parentUser || !parentUser.email) {
          console.warn(`⚠️ No email found for parent ${group.parent}`);
          return;
        }

        // Create student list for email
        const studentList = group.students.map(student => `
          <div style="margin: 10px 0; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
            <strong>${student.name}</strong><br>
            <small>UID: ${student.uid || 'N/A'}</small>
          </div>
        `).join('');

        // Build additional details - FIXED: Use sport location instead of event location
        let additionalDetails = '';
        if (event) {
          additionalDetails += `<p><strong>Event:</strong> ${event.name}</p>`;
          additionalDetails += `<p><strong>Event Date:</strong> ${formatDate(event.startDate)}</p>`;
        }
        // Use sport location and address instead of event
        additionalDetails += `<p><strong>Sport Location:</strong> ${sport.location || 'TBD'}</p>`;
        additionalDetails += `<p><strong>Sport Address:</strong> ${sport.address || 'TBD'}</p>`;
        if (includeCertification) {
          additionalDetails += `<p><strong>Certification:</strong> Included</p>`;
        }

        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2961b6; color: white; padding: 20px; text-align: center;">
              <h2>Registration Successful!</h2>
            </div>
            
            <div style="padding: 20px;">
              <p>Dear ${parentUser.name},</p>
              
              <p>Great news! Your payment has been processed successfully and the following ${group.students.length > 1 ? 'students have' : 'student has'} been registered for <strong>${sport.name}</strong>:</p>
              
              <div style="margin: 20px 0;">
                ${studentList}
              </div>
              
              ${additionalDetails}
              
              <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #2e7d32; margin-top: 0;">What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>You will receive further instructions via email closer to the event date</li>
                  <li>Please ensure students arrive 30 minutes before their scheduled time</li>
                  <li>Bring a valid ID and any required sports equipment</li>
                  ${includeCertification ? '<li>Certificate will be provided after successful completion</li>' : ''}
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://rovers.life/login" style="display: inline-block; background-color: #2961b6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  📋 View Registration Details
                </a>
              </div>
              
              <p>Thank you for choosing our sports program!</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                <p>If you have any questions, please contact our support team.</p>
                <p>Registration ID: ${group.registrations[0]._id}</p>
                <p>Payment ID: ${group.registrations[0].paymentIntentId}</p>
              </div>
            </div>
          </div>
        `;

        await EmailService.sendEmail(
          parentUser.email,
          parentUser.name,
          `Registration Confirmed - ${sport.name}`,
          emailContent
        );

        console.log(`✅ Email sent to ${parentUser.email} for ${group.students.length} students`);
      } catch (error) {
        console.error(`❌ Failed to send email to parent ${group.parent}:`, error);
      }
    });

    // Wait for all emails to complete (but don't throw if some fail)
    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    console.log(`📧 Bulk email sending completed: ${successCount} sent, ${failureCount} failed`);
  }
}

module.exports = RegistrationService;