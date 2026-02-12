const express = require('express');
const { requireUser } = require('./middleware/auth');
const StudentService = require('../services/studentService');
const Sport = require('../models/Sport');
const Student = require('../models/Student');
const ParentStudent = require('../models/ParentStudent'); // Added import for ParentStudent
const Distance = require('../models/Distance'); // Added import for Distance
const SportSubType = require('../models/SportSubType'); // Added import for SportSubType
const AgeCategory = require('../models/AgeCategory'); // Added import for AgeCategory
const mongoose = require('mongoose'); // Added import for mongoose

const router = express.Router();

// Get students with filters
router.get('/', requireUser, async (req, res, next) => {
  try {
    const { search, sport, status } = req.query;
    let sportId;
    if (sport && sport !== 'all') {
      const sportDoc = await Sport.findOne({ name: sport });
      if (sportDoc) {
        sportId = sportDoc._id;
      }
    }

    // Normalize status to lowercase
    const normalizedStatus = status ? status.toLowerCase().replace(/\s+/g, ' ') : undefined;

    const students = await StudentService.list({
      search,
      sport: sportId,
      status: normalizedStatus
    });

    return res.json({
      success: true,
      students
    });
  } catch (error) {
    next(error);
  }
});

// Get all sports with expanded details
router.get('/sports', async (req, res, next) => {
  try {
    console.log('Fetching sports with expanded details');
    const sports = await Sport.find()
      .populate('ageCategories', 'ageGroup')
      .populate('distances', 'category value unit')
      .populate('sportSubTypes', 'type')
      .lean();

    return res.json({
      success: true,
      sports: sports.map(sport => ({
        _id: sport._id,
        name: sport.name,
        ageCategories: sport.ageCategories?.map(cat => cat.ageGroup) || [],
        distances: sport.distances?.map(dist => dist.category) || [],
        sportSubTypes: sport.sportSubTypes?.map(subType => subType.type) || []
      }))
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get sport details by ID
router.get('/sports/:sportId/details', async (req, res, next) => {
  try {
    const { sportId } = req.params;
    console.log(`Fetching details for sport with ID: ${sportId}`);

    const sport = await Sport.findById(sportId)
      .populate('ageCategories', 'ageGroup')
      .populate('distances', 'category value unit')
      .populate('sportSubTypes', 'type')
      .lean();

    if (!sport) {
      console.log(`Sport with ID ${sportId} not found`);
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    console.log(`Successfully fetched details for sport: ${sport.name}`);
    return res.json({
      success: true,
      sport: {
        _id: sport._id,
        name: sport.name,
        ageCategories: sport.ageCategories || [],
        distances: sport.distances || [],
        sportSubTypes: sport.sportSubTypes || []
      }
    });
  } catch (error) {
    next(error);
    console.error(`Error fetching details for sport ${req.params.sportId}:`, error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get filterable students with comprehensive filtering options
router.get('/filterable', requireUser, async (req, res, next) => {
  try {
    const { role, _id: userId } = req.user;
    const {
      sportId,
      sportSubTypeId,
      ageCategoryId,
      distanceId,
      search,
      page = 1,
      limit = 50,
      eventId
    } = req.query;

    // Build base query based on user role
    let baseQuery = {};

    if (role === 'parent') {
      // Parents can only see their own students
      const parentStudents = await ParentStudent.find({ parent: userId }).select('student');
      const studentIds = parentStudents.map(ps => ps.student);
      baseQuery._id = { $in: studentIds };
    } else if (role === 'school') {
      // Schools can see students they've added
      const schoolStudents = await ParentStudent.find({ school: userId }).select('student');
      const studentIds = schoolStudents.map(ps => ps.student);
      baseQuery._id = { $in: studentIds };
    }
    // Managers can see all students (no additional filter)

    // Add search functionality
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      baseQuery.$or = [
        { name: searchRegex },
        { uid: searchRegex }
      ];
    }

    // Build aggregation pipeline
    let pipeline = [
      { $match: baseQuery },
      {
        $lookup: {
          from: 'sports',
          localField: 'sport',
          foreignField: '_id',
          as: 'sportDetails'
        }
      },
      {
        $lookup: {
          from: 'distances',
          localField: 'distance',
          foreignField: '_id',
          as: 'distanceDetails'
        }
      },
      {
        $lookup: {
          from: 'sportsubtypes',
          localField: 'sportSubType',
          foreignField: '_id',
          as: 'sportSubTypeDetails'
        }
      },
      {
        $lookup: {
          from: 'agecategories',
          localField: 'ageCategory',
          foreignField: '_id',
          as: 'ageCategoryDetails'
        }
      }
    ];

    // Add sport filter
    if (sportId) {
      pipeline.push({
        $match: { 'sport': new mongoose.Types.ObjectId(sportId) }
      });
    }

    // Add sport sub type filter
    if (sportSubTypeId) {
      pipeline.push({
        $match: { 'sportSubType': new mongoose.Types.ObjectId(sportSubTypeId) }
      });
    }

    // Add age category filter
    if (ageCategoryId) {
      pipeline.push({
        $match: { 'ageCategory': new mongoose.Types.ObjectId(ageCategoryId) }
      });
    }

    // Add distance filter
    if (distanceId) {
      pipeline.push({
        $match: { 'distance': new mongoose.Types.ObjectId(distanceId) }
      });
    }

    // Add registrations lookup - check for sport-specific registrations if sportId provided, 
    // or all registrations if no specific sport (for filtering out any registered students)
    pipeline.push({
      $lookup: {
        from: 'registrations',
        let: { studentId: '$_id' },
        pipeline: sportId ? [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$student', '$$studentId'] },
                  { $eq: ['$sport', new mongoose.Types.ObjectId(sportId)] },
                  { $ne: ['$status', 'rejected'] }
                ]
              }
            }
          }
        ] : eventId ? [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$student', '$$studentId'] },
                  { $eq: ['$event', new mongoose.Types.ObjectId(eventId)] },
                  { $ne: ['$status', 'rejected'] }
                ]
              }
            }
          }
        ] : [
          // For "All Sports", check for any non-rejected registrations for this student
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$student', '$$studentId'] },
                  { $ne: ['$status', 'rejected'] }
                ]
              }
            }
          }
        ],
        as: 'registrations'
      }
    });

    // Project final fields
    pipeline.push({
      $project: {
        name: 1,
        uid: 1,
        dob: 1,
        gender: 1,
        nationality: 1,
        city: 1,
        represents: 1,
        class: 1,
        bloodGroup: 1,
        relationship: 1,
        medicalConditions: 1,
        sport: {
          _id: { $arrayElemAt: ['$sportDetails._id', 0] },
          name: { $arrayElemAt: ['$sportDetails.name', 0] }
        },
        distance: {
          _id: { $arrayElemAt: ['$distanceDetails._id', 0] },
          name: { $arrayElemAt: ['$distanceDetails.name', 0] }
        },
        sportSubType: {
          _id: { $arrayElemAt: ['$sportSubTypeDetails._id', 0] },
          name: { $arrayElemAt: ['$sportSubTypeDetails.name', 0] }
        },
        ageCategory: {
          _id: { $arrayElemAt: ['$ageCategoryDetails._id', 0] },
          ageGroup: { $arrayElemAt: ['$ageCategoryDetails.ageGroup', 0] }
        },
        isRegistered: { $gt: [{ $size: '$registrations' }, 0] },
        age: {
          $floor: {
            $divide: [
              { $subtract: [new Date(), '$dob'] },
              365.25 * 24 * 60 * 60 * 1000
            ]
          }
        }
      }
    });

    // Always filter out registered students in StudentSelection page
    pipeline.push({
      $match: {
        isRegistered: false
      }
    });

    if (sportId) {
      console.log(`Filtering out students already registered for sport: ${sportId}`);
    } else {
      console.log(`Filtering out students with any existing registrations (All Sports filter)`);
    }

    // Add pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // Execute aggregation
    const students = await Student.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = [...pipeline.slice(0, -2)]; // Remove skip and limit
    countPipeline.push({ $count: 'total' });
    const countResult = await Student.aggregate(countPipeline);
    const totalStudents = countResult[0]?.total || 0;

    res.json({
      success: true,
      students,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalStudents / limit),
        totalStudents,
        hasNext: skip + students.length < totalStudents,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching filterable students:', error);
    next(error);
  }
});

// Get filter options for student filtering
router.get('/filter-options', requireUser, async (req, res, next) => {
  try {
    const { role, _id: userId } = req.user;

    // For registration purposes, we need to show ALL available options, not just existing ones
    // Fetch all available sports, distances, sport sub types, and age categories
    const [sports, distances, sportSubTypes, ageCategories] = await Promise.all([
      Sport.find({ hide: { $ne: true } }).lean(),
      Distance.find({}).lean(),
      SportSubType.find({}).lean(),
      AgeCategory.find({}).lean()
    ]);

    let filterData = {};

    try {
      filterData = {
        sports: sports
          .filter(item => item && typeof item.name === 'string' && item.name.trim())
          .sort((a, b) => {
            const nameA = (a && a.name) ? String(a.name) : '';
            const nameB = (b && b.name) ? String(b.name) : '';
            return nameA.localeCompare(nameB);
          }),
        distances: distances
          .filter(item => item && typeof item.category === 'string' && item.category.trim())
          .sort((a, b) => {
            const categoryA = (a && a.category) ? String(a.category) : '';
            const categoryB = (b && b.category) ? String(b.category) : '';
            return categoryA.localeCompare(categoryB);
          }),
        sportSubTypes: sportSubTypes
          .filter(item => item && typeof item.type === 'string' && item.type.trim())
          .sort((a, b) => {
            const typeA = (a && a.type) ? String(a.type) : '';
            const typeB = (b && b.type) ? String(b.type) : '';
            return typeA.localeCompare(typeB);
          }),
        ageCategories: ageCategories
          .filter(item => item && typeof item.ageGroup === 'string' && item.ageGroup.trim())
          .sort((a, b) => {
            const ageGroupA = (a && a.ageGroup) ? String(a.ageGroup) : '';
            const ageGroupB = (b && b.ageGroup) ? String(b.ageGroup) : '';
            return ageGroupA.localeCompare(ageGroupB);
          })
      };
    } catch (sortError) {
      console.error('Error during sorting:', sortError);
      // Fallback to unsorted arrays
      filterData = {
        sports: sports.filter(item => item && typeof item.name === 'string' && item.name.trim()),
        distances: distances.filter(item => item && typeof item.category === 'string' && item.category.trim()),
        sportSubTypes: sportSubTypes.filter(item => item && typeof item.type === 'string' && item.type.trim()),
        ageCategories: ageCategories.filter(item => item && typeof item.ageGroup === 'string' && item.ageGroup.trim())
      };
    }

    res.json({
      success: true,
      filterOptions: filterData
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    next(error);
  }
});

module.exports = router;