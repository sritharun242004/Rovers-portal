const express = require('express');
const { requireUser } = require('./middleware/auth');
const RegistrationService = require('../services/registrationService');
const { upload, handleLocalFileUrls } = require('../middleware/uploadToS3');
const Registration = require('../models/Registration');
const Sport = require('../models/Sport');
const ParentStudent = require('../models/ParentStudent');
const User = require('../models/User');
const EmailService = require('../utils/email');
const Event = require('../models/Event');
const { format } = require('date-fns');

const router = express.Router();

const formatDate = (date) => {
  if (!date) return "TBA";
  try {
    return format(new Date(date), "dd-MMM-yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Register a student for a sport with payment screenshot upload
router.post('/register',
  requireUser,
  upload.fields([{ name: 'paymentScreenshot', maxCount: 1 }]),
  handleLocalFileUrls,
  async (req, res, next) => {
    try {
      const registrationData = req.body;

      console.log('Registration data before parsing:', registrationData);

      // Process and validate substitutes
      if (registrationData.substitutes) {
        // Convert to array if it's not already (form submissions might send a single value instead of array)
        registrationData.substitutes = Array.isArray(registrationData.substitutes)
          ? registrationData.substitutes
          : [registrationData.substitutes];

        // Validate that there are at most 2 substitutes
        if (registrationData.substitutes.length > 2) {
          return res.status(400).json({
            success: false,
            message: 'Maximum of 2 substitutes allowed per team'
          });
        }
      } else {
        registrationData.substitutes = [];
      }

      // Properly parse isGroupSport from string to boolean
      registrationData.isGroupSport = registrationData.isGroupSport === 'true' || registrationData.isGroupSport === true;

      console.log('isGroupSport after parsing:', registrationData.isGroupSport);

      // Get payment screenshot URL from uploaded file
      if (req.files && req.files.paymentScreenshot && req.files.paymentScreenshot.length > 0) {
        registrationData.paymentScreenshot = req.files.paymentScreenshot[0].location;
      }

      // Validate input based on sport type and user role
      if (registrationData.isGroupSport) {
        if (!registrationData.studentIds || !Array.isArray(registrationData.studentIds) || registrationData.studentIds.length < 7) {
          console.log('Missing or invalid studentIds for group sport:', {
            studentIds: registrationData.studentIds,
            isArray: Array.isArray(registrationData.studentIds),
            length: registrationData.studentIds ? registrationData.studentIds.length : 0
          });
          return res.status(400).json({
            success: false,
            message: 'Group sports require at least 7 students to be selected'
          });
        }
      } else {
        console.log(req.user.role, "thisis the iuser rple", registrationData)
        // For individual sports, handle both single and multiple student cases
        if (req.user.role === 'school') {
          // School can register multiple students for individual sports
          if (!registrationData.studentIds) {
            return res.status(400).json({
              success: false,
              message: 'Please select at least one student'
            });
          }
        }
      }

      if (!registrationData.sportId) {
        console.log('Missing sportId');
        return res.status(400).json({
          success: false,
          message: 'Sport ID is required'
        });
      }

      // Payment screenshot is required
      if (!registrationData.paymentScreenshot) {
        console.log('Missing payment screenshot');
        return res.status(400).json({
          success: false,
          message: 'Payment screenshot is required'
        });
      }

      console.log('Calling RegistrationService.registerStudent with:', {
        parentId: req.user._id,
        studentIds: req.body.studentIds,
        sportId: req.body.sportId,
        eventId: req.body.eventId,
        ageCategoryId: req.body.ageCategoryId,
        distanceId: req.body.distanceId,
        sportSubTypeId: req.body.sportSubTypeId,
        isGroupSport: registrationData.isGroupSport,
        paymentScreenshot: registrationData.paymentScreenshot,
        transactionId: registrationData.transactionId || ''
      });

      const result = await RegistrationService.registerStudentForSport(
        req.user._id,
        registrationData
      );

      // Fetch sport details
      const sport = await Sport.findById(registrationData.sportId).lean();
      if (!sport) {
        return res.status(404).json({
          success: false,
          message: 'Sport not found'
        });
      }

      // Send confirmation email to each parent
      if (!Array.isArray(registrationData.studentIds)) {
        registrationData.studentIds = [registrationData.studentIds];
      }


      return res.json({
        success: true,
        message: registrationData.isGroupSport
          ? `Group of ${result.studentCount} students registered successfully`
          : req.user.role === 'school'
            ? `${result.studentCount} students registered successfully`
            : 'Student registered successfully',
        registration: result
      });
    } catch (error) {
      next(error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Get students eligible for registration based on sport and age category
router.get('/eligible-students', requireUser, async (req, res, next) => {
  try {
    // if (req.user.role !== 'parent') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }

    const { sportId, ageCategoryId } = req.query;

    if (!sportId) {
      return res.status(400).json({
        success: false,
        message: 'Sport ID is required'
      });
    }

    // Get eligible students for registration
    const eligibleStudents = await RegistrationService.getEligibleStudentsForRegistration(
      req.user._id,
      sportId,
      ageCategoryId
    );

    return res.json({
      success: true,
      isGroupSport: eligibleStudents.isGroupSport,
      students: eligibleStudents.students,
      minRequired: eligibleStudents.isGroupSport ? 7 : 1
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get eligible age categories for a student and sport
router.get('/eligible-categories', requireUser, async (req, res, next) => {
  try {
    // if (req.user.role !== 'parent') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }

    const { studentId, sportId } = req.query;

    if (!studentId || !sportId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and Sport ID are required'
      });
    }

    const eligibleCategories = await RegistrationService.getEligibleAgeCategories(
      studentId,
      sportId
    );

    return res.json({
      success: true,
      eligibleCategories
    });
  } catch (error) {
    next(error)
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get registrations for the logged-in parent
router.get('/parent-registrations', requireUser, async (req, res, next) => {
  try {
    // console.log('Fetching parent registrations');
    // // Make sure user is a parent
    // if (req.user.role !== 'parent') {
    //   console.log('Authorization failed: User role is ot parent');
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }

    const parentId = req.user._id;
    console.log('Fetching registrations for parent:', parentId);

    const registrations = await RegistrationService.getParentRegistrations(parentId);
    console.log('Registrations fetched:', registrations);
    console.log(`Found ${registrations.length} registrations for parent`);

    return res.json({
      success: true,
      registrations
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Verify and get school information by unique code
router.get('/verify-school-code/:uniqueCode', requireUser, async (req, res, next) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Only parents can access this endpoint'
      });
    }

    const { uniqueCode } = req.params;

    if (!uniqueCode) {
      return res.status(400).json({
        success: false,
        message: 'School code is required'
      });
    }

    const UserService = require('../services/userService');
    const school = await UserService.findSchoolByUniqueCode(uniqueCode);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found. Please check the code and try again.'
      });
    }

    return res.json({
      success: true,
      school: {
        _id: school._id,
        name: school.name,
        email: school.email,
        schoolType: school.schoolType,
        contactPersonName: school.contactPersonName,
        address: school.address
      }
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get registration details by ID
router.get('/registration/:id', requireUser, async (req, res, next) => {
  try {
    console.log(`Fetching registration details for ID: ${req.params.id}`);

    // if (req.user.role !== 'parent') {
    //   console.log('Authorization failed: User role is not parent');
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }

    const registrationId = req.params.id;

    // Get the registration details
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
      console.log(`Registration not found with ID: ${registrationId}`);
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if the registration belongs to the requesting user
    // if (registration.parent.toString() !== req.user._id.toString()) {
    //   console.log('User does not have permission to view this registration');
    //   return res.status(403).json({
    //     success: false,
    //     message: 'You do not have permission to view this registration'
    //   });
    // }

    let groupStudents = [];

    // If this is a group registration, get all students in the group
    if (registration.isGroupRegistration && registration.groupRegistrationId) {
      console.log(`Fetching students for group registration ID: ${registration.groupRegistrationId}`);

      const groupRegistrations = await Registration.find({
        groupRegistrationId: registration.groupRegistrationId
      }).populate('student', 'name photo uid dob gender');

      groupStudents = groupRegistrations.map(reg => reg.student);
      console.log(`Found ${groupStudents.length} students in the group`);
    }

    return res.json({
      success: true,
      registration,
      groupStudents: registration.isGroupRegistration ? groupStudents : []
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get detailed registration information including location, payment proof, and participants
router.get('/registration-details/:id', requireUser, async (req, res, next) => {
  try {
    console.log(`Fetching detailed registration information for ID: ${req.params.id}`);

    // if (req.user.role !== 'parent') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }

    const registrationId = req.params.id;
    const parentId = req.user._id;

    const details = await RegistrationService.getRegistrationDetails(registrationId, parentId);

    console.log(details)
    return res.json({
      success: true,
      ...details
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Bulk register multiple students for a sport
router.post('/bulk-register', requireUser, async (req, res, next) => {
  try {
    const { studentIds, sportId, eventId, paymentIntentId } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Student IDs array is required'
      });
    }

    if (!sportId) {
      return res.status(400).json({
        success: false,
        message: 'Sport ID is required'
      });
    }

    // Check if sport exists
    const sport = await Sport.findById(sportId);
    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    // Check if event exists (if provided)
    if (eventId) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
    }

    // Prepare bulk registration data
    const registrationDocuments = studentIds.map(studentId => ({
      student: studentId,
      sport: sportId,
      ...(eventId && { event: eventId }),
      registeredBy: userId,
      paymentIntentId: paymentIntentId || null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Use MongoDB's insertMany for bulk insert (much faster than individual inserts)
    const registrations = await Registration.insertMany(registrationDocuments, {
      ordered: false // Continue inserting even if some fail (e.g., duplicates)
    });

    console.log(`Bulk registration successful: ${registrations.length} students registered for sport ${sportId}`);

    return res.json({
      success: true,
      message: `${registrations.length} students registered successfully`,
      data: {
        registeredCount: registrations.length,
        registrations: registrations.map(reg => ({
          _id: reg._id,
          student: reg.student,
          sport: reg.sport,
          event: reg.event,
          status: reg.status
        }))
      }
    });

  } catch (error) {
    console.error('Error in bulk registration:', error);

    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Some students are already registered for this sport',
        details: error.writeErrors || []
      });
    }

    next(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Bulk registration failed'
    });
  }
});

// Send parent notification for payment
router.post('/notify-parents', requireUser, async (req, res, next) => {
  try {
    const { studentIds, eventId, sportId } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Only allow school users to send parent notifications
    if (userRole !== 'school') {
      return res.status(403).json({
        success: false,
        message: 'Only school users can send parent notifications'
      });
    }

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Student IDs are required'
      });
    }

    if (!eventId || !sportId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID and Sport ID are required'
      });
    }

    // Get event and sport details
    const [event, sport] = await Promise.all([
      Event.findById(eventId),
      Sport.findById(sportId)
    ]);

    if (!event || !sport) {
      return res.status(404).json({
        success: false,
        message: 'Event or sport not found'
      });
    }

    // Get school user details
    const schoolUser = await User.findById(userId);
    const schoolName = schoolUser?.name || 'School';

    // Get student details and their parent emails
    const parentStudentRelations = await ParentStudent.find({
      student: { $in: studentIds }
    }).populate('student', 'name').populate('parent', 'email name');

    if (parentStudentRelations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No parent-student relationships found for the selected students'
      });
    }

    // Group students by parent email
    const parentEmailMap = new Map();
    parentStudentRelations.forEach(relation => {
      const parentEmail = relation.parent.email;
      const studentName = relation.student.name;

      if (!parentEmailMap.has(parentEmail)) {
        parentEmailMap.set(parentEmail, []);
      }
      parentEmailMap.get(parentEmail).push(studentName);
    });

    // Send emails to all parent emails
    const parentEmails = Array.from(parentEmailMap.keys());
    const allStudentNames = Array.from(new Set(parentStudentRelations.map(r => r.student.name)));

    await EmailService.sendParentPaymentNotification(
      parentEmails,
      allStudentNames,
      event.name,
      sport.name,
      schoolName
    );

    return res.json({
      success: true,
      message: `Parent notifications sent successfully to ${parentEmails.length} email(s)`,
      data: {
        emailsSent: parentEmails.length,
        studentsCount: allStudentNames.length
      }
    });

  } catch (error) {
    console.error('Error sending parent notifications:', error);
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;