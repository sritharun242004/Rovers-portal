const express = require('express');
const mongoose = require('mongoose');
const { requireUser } = require('./middleware/auth');
const ParentService = require('../services/parentService');
const { uploadToS3, uploadBulkFiles, handleLocalFileUrls } = require('../utils/s3');
const SportLinkService = require('../services/sportLinkService');
const Student = require('../models/Student');
const ParentStudent = require('../models/ParentStudent');
const Sport = require('../models/Sport');
const Distance = require('../models/Distance');
const SportSubType = require('../models/SportSubType');
const AgeCategory = require('../models/AgeCategory');
const User = require('../models/User');
const UserService = require('../services/userService');
const EmailService = require('../utils/email');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const router = express.Router();
const upload = uploadToS3;

// Error handler for multer/AWS errors
const handleUploadError = (err, req, res, next) => {
  if (err) {
    console.error('Upload error:', err);
    
    // Check if it's an AWS error
    if (err.message && (
      err.message.includes('AWS Access Key Id') ||
      err.message.includes('does not exist in our records') ||
      err.message.includes('InvalidAccessKeyId') ||
      err.message.includes('SignatureDoesNotMatch')
    )) {
      return res.status(400).json({
        success: false,
        message: 'AWS credentials are invalid or incorrect. Please check your AWS configuration in the .env file, or remove AWS credentials to use local file storage.',
        error: 'Invalid AWS credentials'
      });
    }
    
    // Check for multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size limit exceeded. Maximum allowed size is 5MB.'
      });
    }
    
    if (err.message && err.message.includes('Only')) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    // Generic error
    return res.status(500).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
  next();
};

// Helper function to parse file data
const parseFileData = async (file) => {
  let studentsData = [];
  const filePath = file.location || file.path;
  const fileExtension = path.extname(file.originalname).toLowerCase();

  console.log('Parsing file:', file.originalname, 'Extension:', fileExtension);

  if (fileExtension === '.csv') {
    if (file.location && file.location.startsWith('http')) {
      // For S3 files, download and parse
      const response = await axios.get(file.location);
      const csvData = response.data;

      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          studentsData.push(row);
        }
      }
    } else {
      // For local files
      const results = [];
      const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          studentsData = results;
        });

      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    }
  } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
    let workbook;

    if (file.location && file.location.startsWith('http')) {
      // For S3 files, download first
      const response = await axios.get(file.location, { responseType: 'arraybuffer' });
      workbook = xlsx.read(response.data, { type: 'buffer' });
    } else {
      // For local files
      workbook = xlsx.readFile(filePath);
    }

    const sheetName = workbook.SheetNames[0];
    console.log('Available sheets:', workbook.SheetNames);
    console.log('Using sheet:', sheetName);

    const worksheet = workbook.Sheets[sheetName];
    // Use object-based parsing directly instead of array-based
    studentsData = xlsx.utils.sheet_to_json(worksheet, {
      defval: '',
      blankrows: false
    });

    // Ensure all values are strings to prevent .trim() errors later
    studentsData = studentsData.map(row => {
      const obj = {};
      Object.keys(row).forEach(key => {
        const value = row[key];
        obj[key] = value != null ? String(value) : '';
      });
      return obj;
    });

    // Debug: Log the first row to see actual column names
    if (studentsData.length > 0) {
      console.log('First row column names:', Object.keys(studentsData[0]));
      console.log('First row data:', studentsData[0]);
    }
  }

  console.log('Parsed data sample:', studentsData.slice(0, 2));
  return studentsData;
};

// Helper function to validate student data (expects already mapped data)
const validateStudentData = (mappedData, rowNumber) => {
  const errors = [];
  let formattedDob = null;

  console.log(`Validating row ${rowNumber}:`, mappedData);

  // Required fields validation
  if (!mappedData.name || !String(mappedData.name).trim()) {
    errors.push('Name is required');
  }

  if (!mappedData.uid || !String(mappedData.uid).trim()) {
    errors.push('UID is required');
  }

  // Required sport field
  if (!mappedData.sport || !String(mappedData.sport).trim()) {
    errors.push('Sport is required');
  }

  // Distance field - will be validated conditionally based on sport requirements
  // (validation moved to validateSportDistanceData function)

  // Required DOB field
  if (!mappedData.dob || !String(mappedData.dob).trim()) {
    errors.push('Date of Birth is required');
  }

  // Required gender field
  if (!mappedData.gender || !String(mappedData.gender).trim()) {
    errors.push('Gender is required');
  }

  // Email validation for parent email
  if (mappedData.parentEmail && String(mappedData.parentEmail).trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(mappedData.parentEmail).trim())) {
      errors.push('Invalid parent email format');
    }
  }

  // Date validation for DOB
  if (mappedData.dob && String(mappedData.dob).trim()) {
    const dobString = String(mappedData.dob).trim();

    console.log(`Row ${rowNumber} DOB validation:`, {
      originalDob: mappedData.dob,
      trimmedDob: dobString,
      dobLength: dobString.length
    });

    // Accept multiple date formats
    const ddmmyyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;  // 14/09/2000 or 1/9/2000
    const ddmmyyyyDashRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;  // 14-09-2000 or 1-9-2000
    const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;  // 2000-09-14
    const ddmmmyyyyRegex = /^\d{1,2}[-\s][A-Za-z]{3,9}[-\s]\d{4}$/;  // 14-Sep-2000, 14 Sep 2000
    const excelSerialRegex = /^\d{4,5}$/;  // Excel serial numbers like 44109

    let isValidFormat = false;
    let parsedDate = null;

    // Helper function to parse month names
    const parseMonth = (monthStr) => {
      const months = {
        'jan': 0, 'january': 0,
        'feb': 1, 'february': 1,
        'mar': 2, 'march': 2,
        'apr': 3, 'april': 3,
        'may': 4,
        'jun': 5, 'june': 5,
        'jul': 6, 'july': 6,
        'aug': 7, 'august': 7,
        'sep': 8, 'september': 8,
        'oct': 9, 'october': 9,
        'nov': 10, 'november': 10,
        'dec': 11, 'december': 11
      };

      const monthIndex = months[monthStr.toLowerCase()];
      console.log(`Month parsing: "${monthStr}" -> ${monthIndex}`);
      return monthIndex;
    };

    // Helper function to convert Excel serial date to JavaScript Date
    const excelSerialToDate = (serial) => {
      // Excel uses 1900-01-01 as day 1, but incorrectly treats 1900 as a leap year
      // So we need to adjust for this
      const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
      return new Date(excelEpoch.getTime() + (serial * 24 * 60 * 60 * 1000));
    };

    // Helper function to format date as DD-MMM-YYYY
    const formatDateToDDMMMyyyy = (date) => {
      if (!date || !(date instanceof Date) || isNaN(date)) return null;

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const day = String(date.getDate()).padStart(2, '0');
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    };

    if (ddmmyyyyRegex.test(dobString)) {
      // Parse DD/MM/YYYY format
      console.log(`Row ${rowNumber}: Matched DD/MM/YYYY format`);
      const [day, month, year] = dobString.split('/');
      parsedDate = new Date(year, month - 1, day); // month is 0-indexed
      isValidFormat = true;
    } else if (ddmmyyyyDashRegex.test(dobString)) {
      // Parse DD-MM-YYYY format
      console.log(`Row ${rowNumber}: Matched DD-MM-YYYY format`);
      const [day, month, year] = dobString.split('-');
      parsedDate = new Date(year, month - 1, day); // month is 0-indexed
      isValidFormat = true;
    } else if (yyyymmddRegex.test(dobString)) {
      // Parse YYYY-MM-DD format
      console.log(`Row ${rowNumber}: Matched YYYY-MM-DD format`);
      parsedDate = new Date(dobString);
      isValidFormat = true;
    } else if (ddmmmyyyyRegex.test(dobString)) {
      // Parse DD-MMM-YYYY or DD MMM YYYY format
      console.log(`Row ${rowNumber}: Matched DD-MMM-YYYY or DD MMM YYYY format`);
      const parts = dobString.includes('-') ? dobString.split('-') : dobString.split(' ');
      const day = parseInt(parts[0]);
      const monthIndex = parseMonth(parts[1]);
      const year = parseInt(parts[2]);

      if (monthIndex !== undefined) {
        parsedDate = new Date(year, monthIndex, day);
        console.log(`Row ${rowNumber}: Parsed date components: day=${day}, monthIndex=${monthIndex}, year=${year}, parsedDate=${parsedDate}`);
        isValidFormat = true;
      } else {
        console.log(`Row ${rowNumber}: Month index undefined for month: "${parts[1]}"`);
      }
    } else if (excelSerialRegex.test(dobString)) {
      // Parse Excel serial date number
      console.log(`Row ${rowNumber}: Matched Excel serial format`);
      const serialNumber = parseInt(dobString);
      if (serialNumber >= 1 && serialNumber <= 73050) { // Reasonable range for dates
        parsedDate = excelSerialToDate(serialNumber);
        isValidFormat = true;
      }
    } else {
      console.log(`Row ${rowNumber}: No format matched for DOB: "${dobString}"`);
    }

    if (!isValidFormat) {
      errors.push('Invalid date format for DOB (should be DD/MM/YYYY, DD-MM-YYYY, DD-MMM-YYYY, YYYY-MM-DD, or Excel serial number)');
    } else if (parsedDate && parsedDate.toString() === 'Invalid Date') {
      errors.push('Invalid date for DOB (please check day, month, and year values)');
    } else if (parsedDate) {
      // Additional validation: check if date is reasonable
      const currentDate = new Date();
      const minDate = new Date(currentDate.getFullYear() - 100, 0, 1); // 100 years ago
      const maxDate = new Date(); // today

      if (parsedDate < minDate || parsedDate > maxDate) {
        errors.push('DOB must be between 100 years ago and today');
      } else {
        // Format the valid date to DD-MMM-YYYY
        formattedDob = formatDateToDDMMMyyyy(parsedDate);
        console.log(`Row ${rowNumber}: Final formatted DOB: ${formattedDob}`);
      }
    }
  }

  // Gender validation
  if (mappedData.gender && String(mappedData.gender).trim()) {
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(String(mappedData.gender).toLowerCase())) {
      errors.push('Invalid gender (should be male, female, or other)');
    }
  }

  if (errors.length > 0) {
    console.log(`Row ${rowNumber} validation errors:`, errors);
  }

  return { errors, formattedDob };
};

// Helper function to validate sport, distance, and sport sub type data
const validateSportDistanceData = async (mappedData, rowNumber) => {
  const errors = [];

  console.log(`Validating sport/distance data for row ${rowNumber}:`, {
    sport: mappedData.sport,
    distance: mappedData.distance,
    sportSubType: mappedData.sportSubType
  });

  // Validate sport exists
  if (mappedData.sport && String(mappedData.sport).trim()) {
    let sportFound = false;

    console.log(`Looking for sport: "${mappedData.sport}"`);

    // Try to find by ID first
    if (mongoose.Types.ObjectId.isValid(mappedData.sport)) {
      const sportById = await Sport.findById(mappedData.sport);
      if (sportById) {
        sportFound = true;
        console.log(`Sport found by ID: ${sportById.name}`);
      }
    }

    // If not found by ID, try to find by name
    if (!sportFound) {
      console.log(`Searching for sport by name with regex: ^${mappedData.sport}$`);
      const sportByName = await Sport.findOne({
        name: { $regex: new RegExp(`^${mappedData.sport}$`, 'i') },
        hide: { $ne: true }
      });
      if (sportByName) {
        sportFound = true;
        console.log(`Sport found by name: ${sportByName.name}`);
      } else {
        console.log(`Sport not found by name. Let me check all sports in database:`);
        const allSports = await Sport.find({ hide: { $ne: true } });
        console.log('All sports in database:', allSports.map(s => s.name));
      }
    }

    if (!sportFound) {
      errors.push(`Invalid sport: "${mappedData.sport}" not found in database`);
    }
  }

  // Validate distance exists only if sport requires it
  if (mappedData.distance && String(mappedData.distance).trim()) {
    let distanceFound = false;

    // Try to find by ID first
    if (mongoose.Types.ObjectId.isValid(mappedData.distance)) {
      const distanceById = await Distance.findById(mappedData.distance);
      if (distanceById) {
        distanceFound = true;
        console.log(`Distance found by ID: ${distanceById.category}`);
      }
    }

    // If not found by ID, try to find by category
    if (!distanceFound) {
      const distanceByCategory = await Distance.findOne({
        category: { $regex: new RegExp(`^${mappedData.distance}$`, 'i') }
      });
      if (distanceByCategory) {
        distanceFound = true;
        console.log(`Distance found by category: ${distanceByCategory.category}`);
      }
    }

    if (!distanceFound) {
      errors.push(`Invalid distance: "${mappedData.distance}" not found in database`);
    }
  }

  // Check if sport requires distances and validate accordingly
  if (mappedData.sport && String(mappedData.sport).trim()) {
    let sportDoc = null;
    let sportId = null;

    // Try to find sport by ID first
    if (mongoose.Types.ObjectId.isValid(mappedData.sport)) {
      sportDoc = await Sport.findById(mappedData.sport);
      if (sportDoc) sportId = sportDoc._id;
    }

    // If not found by ID, try to find by name
    if (!sportDoc) {
      const trimmedSport = String(mappedData.sport).trim();
      const escapedSport = trimmedSport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      sportDoc = await Sport.findOne({
        name: { $regex: new RegExp(`^${escapedSport}$`, 'i') },
        hide: { $ne: true }
      });
      if (sportDoc) sportId = sportDoc._id;
    }

    if (sportDoc) {
      console.log(`Sport "${sportDoc.name}" has ${sportDoc.distances?.length || 0} distances linked`);

      // If sport has distances linked, distance is required
      if (sportDoc.distances && sportDoc.distances.length > 0) {
        if (!mappedData.distance || !String(mappedData.distance).trim()) {
          errors.push(`Distance is required for sport "${sportDoc.name}"`);
        }
      } else {
        // If sport has no distances linked, distance should not be provided
        if (mappedData.distance && String(mappedData.distance).trim()) {
          errors.push(`Sport "${sportDoc.name}" does not require distances. Please remove distance field.`);
        }
      }
    }
  }

  // Validate sport sub type exists and belongs to the sport (if provided)
  if (mappedData.sportSubType && String(mappedData.sportSubType).trim()) {
    console.log(`Looking for sport sub type: "${mappedData.sportSubType}"`);

    // First, find the sport to get its ID
    let sportId = null;
    if (mongoose.Types.ObjectId.isValid(mappedData.sport)) {
      sportId = mappedData.sport;
    } else {
      const trimmedSport2 = String(mappedData.sport).trim();
      const escapedSport2 = trimmedSport2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const sportDoc = await Sport.findOne({
        name: { $regex: new RegExp(`^${escapedSport2}$`, 'i') },
        hide: { $ne: true }
      });
      if (sportDoc) {
        sportId = sportDoc._id;
      }
    }

    if (!sportId) {
      errors.push(`Cannot validate sport sub type: sport "${mappedData.sport}" not found`);
    } else {
      // Check if this sport has any sub types
      const availableSubTypes = await SportSubType.find({ sport: sportId });

      if (availableSubTypes.length === 0) {
        // Sport has no sub types, so sportSubType should not be provided
        errors.push(`Sport "${mappedData.sport}" does not have sub types. Please remove the sport sub type field.`);
      } else {
        // Sport has sub types, validate the provided one
        let sportSubTypeFound = false;

        // Try to find by ID first (if it's a valid ObjectId)
        if (mongoose.Types.ObjectId.isValid(mappedData.sportSubType)) {
          const sportSubTypeById = await SportSubType.findOne({
            _id: mappedData.sportSubType,
            sport: sportId
          });
          if (sportSubTypeById) {
            sportSubTypeFound = true;
            console.log(`Sport sub type found by ID: ${sportSubTypeById.type}`);
          }
        }

        // If not found by ID, try to find by type name
        if (!sportSubTypeFound) {
          const trimmedSubType = String(mappedData.sportSubType).trim();
          const escapedSubType = trimmedSubType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const sportSubTypeByType = await SportSubType.findOne({
            sport: sportId,
            type: { $regex: new RegExp(`^${escapedSubType}$`, 'i') }
          });
          if (sportSubTypeByType) {
            sportSubTypeFound = true;
            console.log(`Sport sub type found by type: ${sportSubTypeByType.type}`);
          }
        }

        if (!sportSubTypeFound) {
          const availableTypes = availableSubTypes.map(st => st.type).join(', ');
          errors.push(`Invalid sport sub type "${mappedData.sportSubType}" for sport "${mappedData.sport}". Available sub types: ${availableTypes}`);
        }
      }
    }
  } else {
    // Check if sport sub type is required for this sport
    let sportId = null;
    if (mappedData.sport && String(mappedData.sport).trim()) {
      if (mongoose.Types.ObjectId.isValid(mappedData.sport)) {
        sportId = mappedData.sport;
      } else {
        const trimmedSport = String(mappedData.sport).trim();
        const escapedSport = trimmedSport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const sportDoc = await Sport.findOne({
          name: { $regex: new RegExp(`^${escapedSport}$`, 'i') },
          hide: { $ne: true }
        });
        if (sportDoc) {
          sportId = sportDoc._id;
        }
      }

      if (sportId) {
        const availableSubTypes = await SportSubType.find({ sport: sportId });
        if (availableSubTypes.length > 0) {
          const availableTypes = availableSubTypes.map(st => st.type).join(', ');
          errors.push(`Sport sub type is required for sport "${mappedData.sport}". Available sub types: ${availableTypes}`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.log(`Sport/distance validation errors for row ${rowNumber}:`, errors);
  }

  return { errors };
};

// Get children for the logged-in parent
router.get('/children', requireUser, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await ParentService.getChildrenCount(req.user._id, search);

    // Get paginated children
    const children = await ParentService.getChildren(req.user._id, {
      page,
      limit,
      search,
      skip
    });

    // Fetch parent details for each child
    const childrenWithParentInfo = await Promise.all(children.map(async (child) => {
      const parentStudent = await ParentStudent.findOne({ student: child._id });
      const parentUser = await User.findById(parentStudent?.parent);
      return {
        ...child,
        parentEmail: parentUser?.email || '',
        parentName: parentUser?.name || '',
        phoneNumber: parentUser?.phoneNumber || '',
        countryCode: parentUser?.countryCode || ''
      };
    }));

    return res.json({
      success: true,
      children: childrenWithParentInfo,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
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

// Get a single student by ID
router.get('/students/:studentId', requireUser, async (req, res, next) => {
  try {
    const { studentId } = req.params;
    
    console.log('GET /students/:studentId called');
    console.log('StudentId:', studentId);
    console.log('User ID:', req.user._id);
    console.log('User role:', req.user.role);

    // Check if student exists and parent has access to it
    let parentStudent;
    if (req.user.role === 'school') {
      console.log('Searching for school-student relationship');
      parentStudent = await ParentStudent.findOne({
        school: req.user._id,
        student: studentId
      });
    } else {
      console.log('Searching for parent-student relationship');
      parentStudent = await ParentStudent.findOne({
        parent: req.user._id,
        student: studentId
      });
    }
    
    console.log('ParentStudent relationship found:', parentStudent);

    if (!parentStudent) {
      console.error('No ParentStudent relationship found for studentId:', studentId);
      
      // Check if student exists at all
      const studentExists = await Student.findById(studentId);
      console.log('Student exists in DB:', !!studentExists);
      
      // Check all ParentStudent records for this student
      const allRelationships = await ParentStudent.find({ student: studentId });
      console.log('All relationships for this student:', allRelationships);
      
      return res.status(404).json({
        success: false,
        message: 'Student not found or you do not have permission to view this student',
        debug: {
          studentExists: !!studentExists,
          relationshipsCount: allRelationships.length
        }
      });
    }

    // Fetch the student with populated fields
    const student = await Student.findById(studentId)
      .populate('sport', 'name')
      .populate('ageCategory', 'ageGroup')
      .populate('distance', 'category value unit')
      .populate('sportSubType', 'type')
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Add relationship from parent-student table
    student.relationship = parentStudent.relationship;

    // Fetch parent details
    const parent = await User.findById(parentStudent.parent).lean();
    if (parent) {
      student.parentEmail = parent.email;
      student.parentName = parent.name;
      student.phoneNumber = parent.phoneNumber;
      student.countryCode = parent.countryCode;
    }

    console.log("Full student object from DB:", JSON.stringify(student, null, 2));
    console.log(student);


    return res.json({
      success: true,
      student
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student details'
    });
  }
});

// Link a student to a parent
router.post('/link-child', requireUser, async (req, res, next) => {
  try {
    // if (req.user.role !== 'parent') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }

    const { studentUid, relationship } = req.body;

    if (!studentUid) {
      return res.status(400).json({
        success: false,
        message: 'Student UID is required'
      });
    }
    const result = await ParentService.linkChild(
      req.user._id,
      studentUid,
      relationship
    );
    return res.json({
      success: true,
      message: 'Student linked successfully',
      student: {
        _id: result.student._id,
        name: result.student.name,
        uid: result.student.uid
      }
    });
  } catch (error) {
    next(error)
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Submit a query
router.post('/queries', requireUser, async (req, res, next) => {
  try {
    // if (req.user.role !== 'parent') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }

    const { studentId, subject, message } = req.body;

    // Only require subject and message
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    // If studentId is not provided, set it to null
    const query = await ParentService.submitQuery(
      req.user._id,
      studentId || null, // Make studentId optional
      subject,
      message
    );

    return res.json({
      success: true,
      message: 'Query submitted successfully',
      query
    });
  } catch (error) {
    next(error)
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Upload student photo
router.post('/upload-photo/:studentId', requireUser, uploadToS3.single('photo'), handleUploadError, handleLocalFileUrls, async (req, res, next) => {
  try {
    // if (req.user.role !== 'parent') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }

    const { studentId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const photoUrl = req.file.location;
    const updatedStudent = await ParentService.updateStudentPhoto(
      req.user._id,
      studentId,
      photoUrl
    );
    return res.json({
      success: true,
      message: 'Photo uploaded successfully',
      student: {
        _id: updatedStudent._id,
        name: updatedStudent.name,
        photo: updatedStudent.photo
      }
    });
  } catch (error) {
    next(error)
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all queries for the logged-in parent
router.get('/queries', requireUser, async (req, res, next) => {
  try {
    // if (req.user.role !== 'parent') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }
    const queries = await ParentService.getQueries(req.user._id);
    return res.json({
      success: true,
      queries
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add middleware to handle file upload and check for duplicate UID
router.post('/students', requireUser, uploadToS3.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]), handleUploadError, handleLocalFileUrls, async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== 'parent' && role !== 'school') {
      return res.status(403).json({
        success: false,
        message: 'Only parents and schools can add students'
      });
    }

    // Check if Nationality ID (uid) already exists
    const existingStudent = await Student.findOne({ uid: req.body.uid });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'A student with this Nationality ID already exists. Please use a unique ID.'
      });
    }

    // If the request is from a school, create a parent user first
    let parentId = req.user._id;
    let parentEmail, parentName;
    if (role === 'school') {
      parentEmail = req.body.parentEmail;
      parentName = req.body.parentName;

      // Check if parent already exists
      let parent = await User.findOne({ email: parentEmail });

      if (!parent) {
        // Create new parent user
        parent = await UserService.create({
          email: parentEmail,
          name: parentName,
          role: 'parent',
          phoneNumber: req.body.phoneNumber,
          countryCode: req.body.countryCode,
          isActive: true
        });
      }

      parentId = parent._id;

      // Send email to the parent after creating the user
      await EmailService.sendEmail(
        parent.email,
        'Welcome to the Student Registration System',
        "Your account has been created successfully!",
        `<div style="font-family: Arial, sans-serif;">
          <h2>Welcome, ${parentName}!</h2>
          <p>Your account has been created successfully. You can now manage your child's registration.</p>
        </div>`
      );
    } else {

    }

    // Set default sport ID if not provided (assuming a default sport exists)
    const defaultSport = await Sport.findOne();

    const studentData = {
      ...req.body,
      sport: req.body.sport || defaultSport._id
    };

    if (req.files && req.files.photo && req.files.photo[0]) {
      studentData.photo = req.files.photo[0].location;
    }

    if (req.files && req.files.idProof && req.files.idProof[0]) {
      studentData.idProof = req.files.idProof[0].location;
    }

    // Create and save the student
    const student = new Student(studentData);
    await student.save();

    // Link the student to the parent and school
    const parentStudent = new ParentStudent({
      parent: parentId,
      student: student._id,
      school: role === 'school' ? req.user._id : null,
      relationship: studentData.relationship || 'guardian'
    });
    await parentStudent.save();
    console.log('Student linked to parent and school:', {
      parentId: parentId,
      studentId: student._id,
      schoolId: role === 'school' ? req.user._id : null,
      relationship: studentData.relationship || 'guardian'
    });

    // Send email to the parent with student informatio
    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      student
    });
  } catch (error) {


    // Check for multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size limit exceeded. Maximum allowed size is 5MB.'
      });
    }

    if (error.message.includes('Only')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error adding student'
    });
    next(error)
  }
});

// Update student route with similar checks
router.put('/students/:studentId', requireUser, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]), handleLocalFileUrls, async (req, res, next) => {
  try {
    const { role } = req.user;
    const userId = req.user._id;
    const { studentId } = req.params;
    console.log(studentId, userId);

    // Check if the student belongs to this parent
    let parentStudent;
    if (role === 'school') {
      parentStudent = await ParentStudent.findOne({
        school: userId,
        student: studentId
      });
    } else {
      parentStudent = await ParentStudent.findOne({
        parent: userId,
        student: studentId
      });
    }
    console.log(parentStudent);

    if (!parentStudent) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this student'
      });
    }

    // Update parent fields if the role is school
    if (role === 'school') {
      const { parentEmail, parentName, phoneNumber, countryCode } = req.body;

      // Update parent information
      await User.findByIdAndUpdate(parentStudent.parent, {
        email: parentEmail,
        name: parentName,
        phoneNumber,
        countryCode
      });
    }

    // Check if updating the UID and if it's unique
    if (req.body.uid) {
      const existingStudent = await Student.findOne({
        uid: req.body.uid,
        _id: { $ne: studentId } // Exclude the current student
      });

      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'A student with this Nationality ID already exists. Please use a unique ID.'
        });
      }
    }

    const updateData = { ...req.body };

    if (req.files && req.files.photo && req.files.photo[0]) {
      updateData.photo = req.files.photo[0].location;
    }

    if (req.files && req.files.idProof && req.files.idProof[0]) {
      updateData.idProof = req.files.idProof[0].location;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Student updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Error updating student:', error);

    // Check for multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size limit exceeded. Maximum allowed size is 5MB.'
      });
    }

    if (error.message.includes('Only')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating student'
    });
  }
});

// Implementation for adding a new student with expanded details
router.post('/add-student', requireUser, uploadToS3.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]), handleUploadError, handleLocalFileUrls, async (req, res, next) => {
  try {
    console.log('=== ADD STUDENT API CALLED ===');
    console.log('User ID:', req.user._id);
    console.log('User role:', req.user.role);
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Files received:', req.files);
    console.log('Files object keys:', req.files ? Object.keys(req.files) : 'No files object');

    if (req.files && req.files.idProof) {
      console.log('ID Proof files:', req.files.idProof);
      console.log('ID Proof files length:', req.files.idProof.length);
    }

    const studentData = req.body;

    // Handle school role - create parent user if needed
    let parentId = req.user._id;
    let parentEmail, parentName;

    if (req.user.role === 'school') {
      parentEmail = req.body.parentEmail;
      parentName = req.body.parentName;

      if (!parentEmail || !parentName) {
        return res.status(400).json({
          success: false,
          message: 'Parent email and name are required when adding student from school'
        });
      }

      // Check if parent already exists
      let parent = await User.findOne({ email: parentEmail });

      if (!parent) {
        // Create new parent user
        parent = await UserService.create({
          email: parentEmail,
          name: parentName,
          role: 'parent',
          phoneNumber: req.body.phoneNumber,
          countryCode: req.body.countryCode,
          isActive: true
        });
        console.log('Created new parent user:', parent._id);
      } else {
        console.log('Found existing parent user:', parent._id);
      }

      parentId = parent._id;

      // Send email to the parent after creating the user
      await EmailService.sendEmail(
        parent.email,
        'Welcome to the Student Registration System',
        "Your account has been created successfully!",
        `<div style="font-family: Arial, sans-serif;">
          <h2>Welcome, ${parentName}!</h2>
          <p>Your account has been created successfully. You can now manage your child's registration.</p>
        </div>`
      );
    }

    // Make ID proof optional for school role but required for parent role
    const requireIdProof = req.user.role === 'parent';

    if (requireIdProof && (!req.files || !req.files.idProof || req.files.idProof.length === 0)) {
      console.log('Error: Missing required ID proof file for parent role');
      console.log('req.files exists:', !!req.files);
      console.log('req.files.idProof exists:', !!(req.files && req.files.idProof));
      console.log('req.files.idProof length:', req.files && req.files.idProof ? req.files.idProof.length : 'N/A');
      return res.status(400).json({
        success: false,
        message: 'Aadhaar/UAE ID is required'
      });
    }

    // Required fields validation (distance validated conditionally below)
    if (!studentData.name || !studentData.dob || !studentData.gender || !studentData.sport) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, dob, gender, and sport are required'
      });
    }

    // Conditionally require distance based on sport configuration
    try {
      let sportDoc = null;
      if (mongoose.Types.ObjectId.isValid(studentData.sport)) {
        sportDoc = await Sport.findById(studentData.sport).lean();
      } else if (studentData.sport) {
        sportDoc = await Sport.findOne({ name: { $regex: new RegExp(`^${String(studentData.sport).trim()}$`, 'i') } }).lean();
      }

      if (sportDoc && Array.isArray(sportDoc.distances) && sportDoc.distances.length > 0) {
        if (!studentData.distance) {
          return res.status(400).json({
            success: false,
            message: `Distance is required for sport "${sportDoc.name}"`
          });
        }
      } else {
        // Ensure distance not set for sports without distances
        if (!sportDoc || (sportDoc && (!sportDoc.distances || sportDoc.distances.length === 0))) {
          delete studentData.distance;
        }
      }
    } catch (e) {
      console.warn('Sport distance requirement check failed:', e?.message);
    }

    // Add file paths if files were uploaded
    if (req.files) {
      if (req.files.idProof && req.files.idProof.length > 0) {
        studentData.idProof = req.files.idProof[0].location;
        console.log('ID Proof file path:', studentData.idProof);
      }
      if (req.files.photo && req.files.photo.length > 0) {
        studentData.photo = req.files.photo[0].location;
        console.log('Photo file path:', studentData.photo);
      }
    }

    // Clean up gender field - remove empty strings
    if (studentData.gender === '' || studentData.gender === null || studentData.gender === undefined) {
      delete studentData.gender; // Let mongoose use default value
    }

    // Validate gender if provided
    if (studentData.gender && !['male', 'female', 'other'].includes(studentData.gender)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gender value. Must be male, female, or other'
      });
    }

    // Conditionally require sport sub type based on sport configuration
    try {
      let sportDoc = null;
      if (mongoose.Types.ObjectId.isValid(studentData.sport)) {
        sportDoc = await Sport.findById(studentData.sport).lean();
      } else if (studentData.sport) {
        sportDoc = await Sport.findOne({ name: { $regex: new RegExp(`^${String(studentData.sport).trim()}$`, 'i') } }).lean();
      }

      if (sportDoc) {
        const subTypeCount = await SportSubType.countDocuments({ sport: sportDoc._id });
        if (subTypeCount > 0 && !studentData.sportSubType) {
          return res.status(400).json({
            success: false,
            message: `Sport sub type is required for sport "${sportDoc.name}"`
          });
        }
        if (subTypeCount === 0) {
          delete studentData.sportSubType;
        }
      }
    } catch (e) {
      console.warn('Sport sub type requirement check failed:', e?.message);
    }

    // Convert string IDs to ObjectIDs where appropriate
    if (studentData.ageCategory && typeof studentData.ageCategory === 'string' && mongoose.Types.ObjectId.isValid(studentData.ageCategory)) {
      studentData.ageCategory = new mongoose.Types.ObjectId(studentData.ageCategory);
    }

    if (studentData.distance && typeof studentData.distance === 'string' && mongoose.Types.ObjectId.isValid(studentData.distance)) {
      studentData.distance = new mongoose.Types.ObjectId(studentData.distance);
    }

    if (studentData.sportSubType && typeof studentData.sportSubType === 'string' && mongoose.Types.ObjectId.isValid(studentData.sportSubType)) {
      studentData.sportSubType = new mongoose.Types.ObjectId(studentData.sportSubType);
    }

    // Improved Sport handling
    console.log('Sport before processing:', studentData.sport);

    if (!studentData.sport) {
      console.log('No sport provided, looking for default sport');
      const Sport = require('../models/Sport');
      try {
        const defaultSport = await Sport.findOne();
        if (defaultSport) {
          studentData.sport = defaultSport._id;
          console.log('Using default sport ID:', defaultSport._id, 'Name:', defaultSport.name);
          console.log('Sport start date:', defaultSport.startDate);
          console.log('Sport end date:', defaultSport.endDate);
        } else {
          return res.status(400).json({
            success: false,
            message: 'No sports found in the system'
          });
        }
      } catch (sportError) {
        console.error('Error finding default sport:', sportError);
        return res.status(500).json({
          success: false,
          message: `Error finding default sport: ${sportError.message}`
        });
      }
    } else if (typeof studentData.sport === 'string') {
      console.log('Sport is provided as string:', studentData.sport);

      // Check if it's a valid ObjectId first
      if (mongoose.Types.ObjectId.isValid(studentData.sport)) {
        console.log('Sport is a valid ObjectId, looking up by ID');
        const Sport = require('../models/Sport');
        const sportById = await Sport.findById(studentData.sport);

        if (sportById) {
          console.log('Found sport by ID:', sportById._id, 'Name:', sportById.name);
          console.log('Sport start date:', sportById.startDate);
          console.log('Sport end date:', sportById.endDate);
          studentData.sport = sportById._id;
        } else {
          console.log('No sport found with ID:', studentData.sport);
          return res.status(400).json({
            success: false,
            message: `Sport with ID ${studentData.sport} not found`
          });
        }
      } else {
        // Try to find by name
        console.log('Looking up sport by name:', studentData.sport);
        const Sport = require('../models/Sport');
        try {
          const sport = await Sport.findOne({ name: { $regex: new RegExp(`^${studentData.sport}$`, 'i') } });
          if (sport) {
            studentData.sport = sport._id;
            console.log('Found sport by name, setting ID:', sport._id, 'Name:', sport.name);
            console.log('Sport start date:', sport.startDate);
            console.log('Sport end date:', sport.endDate);
          } else {
            console.log('Sport not found by name, using default');
            const defaultSport = await Sport.findOne();
            if (defaultSport) {
              studentData.sport = defaultSport._id;
              console.log('Using default sport ID:', defaultSport._id, 'Name:', defaultSport.name);
              console.log('Sport start date:', defaultSport.startDate);
              console.log('Sport end date:', defaultSport.endDate);
            } else {
              return res.status(400).json({
                success: false,
                message: 'No sports found in the system'
              });
            }
          }
        } catch (sportError) {
          console.error('Error finding sport:', sportError);
          return res.status(500).json({
            success: false,
            message: `Error finding sport: ${sportError.message}`
          });
        }
      }
    }

    console.log('Final sport after processing:', studentData.sport);

    // Check if sport sub types exist for this sport, and validate accordingly
    try {
      const sportSubTypes = await SportSubType.find({ sport: studentData.sport });
      console.log(`Found ${sportSubTypes.length} sport sub types for sport ${studentData.sport}`);

      if (sportSubTypes.length > 0) {
        // Sport has sub types, so sportSubType is required
        if (!studentData.sportSubType) {
          return res.status(400).json({
            success: false,
            message: 'Sport sub type is required for this sport'
          });
        }

        // Validate that the provided sportSubType belongs to this sport
        const isValidSubType = sportSubTypes.some(subType =>
          subType._id.toString() === studentData.sportSubType.toString()
        );

        if (!isValidSubType) {
          return res.status(400).json({
            success: false,
            message: 'Invalid sport sub type for the selected sport'
          });
        }
      } else {
        // Sport has no sub types, remove any sportSubType if provided
        if (studentData.sportSubType) {
          console.log('Removing sportSubType as this sport has no sub types');
          delete studentData.sportSubType;
        }
      }
    } catch (subTypeError) {
      console.error('Error validating sport sub types:', subTypeError);
      return res.status(400).json({
        success: false,
        message: `Error validating sport sub types: ${subTypeError.message}`
      });
    }

    // Auto-calculate age category based on DOB and sport
    console.log('=== AGE CATEGORY CALCULATION START ===');
    console.log('studentData.dob:', studentData.dob);
    console.log('studentData.sport:', studentData.sport);
    console.log('studentData before age calculation:', JSON.stringify(studentData, null, 2));

    if (studentData.dob && studentData.sport) {
      try {
        console.log('Auto-calculating age category for DOB:', studentData.dob, 'and sport:', studentData.sport);
        const calculatedAgeCategory = await calculateAgeCategory(studentData.dob, studentData.sport);
        console.log('calculateAgeCategory returned:', calculatedAgeCategory);

        if (calculatedAgeCategory) {
          studentData.ageCategory = calculatedAgeCategory;
          console.log('Age category successfully set to:', calculatedAgeCategory);
          console.log('studentData.ageCategory after assignment:', studentData.ageCategory);
        } else {
          console.error('Age category calculation returned null/undefined');
          return res.status(400).json({
            success: false,
            message: 'Unable to determine age category for the provided date of birth and sport'
          });
        }
      } catch (ageCategoryError) {
        console.error('Error calculating age category:', ageCategoryError);
        return res.status(400).json({
          success: false,
          message: `Error calculating age category: ${ageCategoryError.message}`
        });
      }
    } else {
      console.error('Missing required fields for age calculation:', {
        dob: studentData.dob,
        sport: studentData.sport
      });
      return res.status(400).json({
        success: false,
        message: 'Date of birth and sport are required for age category calculation'
      });
    }
    console.log('=== AGE CATEGORY CALCULATION END ===');

    if (studentData.event && typeof studentData.event === 'string' && mongoose.Types.ObjectId.isValid(studentData.event)) {
      studentData.event = new mongoose.Types.ObjectId(studentData.event);
    }

    // Handle the event relationship if event ID is provided
    if (studentData.event) {
      console.log('Checking event ID:', studentData.event);
      const event = await require('../models/Event').findById(studentData.event);
      if (!event) {
        console.log('Event not found, removing event ID from student data');
        delete studentData.event; // Remove invalid event ID
      } else {
        console.log('Event found with ID:', event._id);
      }
    }

    // Age category is now auto-calculated above, no need for additional processing

    // Handle distance if provided
    if (studentData.distance) {
      console.log('Looking up distance:', studentData.distance);
      // First try to find by ID
      let distance = null;
      try {
        distance = await require('../models/Distance').findById(studentData.distance);
      } catch (err) {
        console.log('Not a valid ID, trying to find by category name');
      }

      if (!distance) {
        // Try to find by category
        distance = await require('../models/Distance').findOne({
          category: studentData.distance
        });
      }

      if (distance) {
        studentData.distance = distance._id;
        console.log('Found distance ID:', distance._id);
      } else {
        console.log('Distance not found, removing from student data');
        delete studentData.distance;
      }
    }

    // Handle sport sub type if provided
    if (studentData.sportSubType && studentData.sport) {
      console.log('Looking up sport sub type:', studentData.sportSubType);
      // First try to find by ID
      let sportSubType = null;
      try {
        sportSubType = await require('../models/SportSubType').findById(studentData.sportSubType);
      } catch (err) {
        console.log('Not a valid ID, trying to find by type and sport');
      }

      if (!sportSubType) {
        // Try to find by type and sport
        sportSubType = await require('../models/SportSubType').findOne({
          type: studentData.sportSubType,
          sport: studentData.sport
        });
      }

      if (sportSubType) {
        studentData.sportSubType = sportSubType._id;
        console.log('Found sport sub type ID:', sportSubType._id);
      } else {
        console.log('Sport sub type not found, removing from student data');
        delete studentData.sportSubType;
      }
    }

    console.log('Creating new student with finalized data:', JSON.stringify(studentData));

    // Create the student document directly to see if there's any validation error
    try {
      const student = new Student(studentData);

      // Log any validation errors
      const validationError = student.validateSync();
      if (validationError) {
        console.error('Validation error:', validationError);
        throw new Error(`Student validation failed: ${validationError.message}`);
      }

      console.log('Student validation passed, saving to database');
      await student.save();
      console.log('Student saved successfully with ID:', student._id);

      // Link the student to the parent and school
      try {
        console.log('Linking student to parent and school with relationship:', studentData.relationship || 'parent');
        const parentStudent = new ParentStudent({
          parent: parentId, // Use the correct parent ID (either existing user or created parent)
          student: student._id,
          school: req.user.role === 'school' ? req.user._id : null,
          relationship: studentData.relationship || 'parent'
        });

        await parentStudent.save();
        console.log('Student linked to parent and school successfully:', {
          parentId: parentId,
          studentId: student._id,
          schoolId: req.user.role === 'school' ? req.user._id : null,
          relationship: studentData.relationship || 'parent'
        });

        return res.json({
          success: true,
          message: 'Student added successfully',
          student: student
        });
      } catch (linkError) {
        console.error('Error linking student to parent:', linkError);
        // If linking fails, try to delete the student to avoid orphaned records
        try {
          await Student.deleteOne({ _id: student._id });
          console.log('Deleted student due to failed parent linking');
        } catch (deleteError) {
          console.error('Failed to delete student after link failure:', deleteError);
        }
        throw new Error(`Failed to link student to parent: ${linkError.message}`);
      }
    } catch (saveError) {
      console.error('Error saving student:', saveError);
      throw new Error(`Failed to save student: ${saveError.message}`);
    }
  } catch (error) {
    next(error)
    console.error('Error adding student (main try/catch):', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add a new student with expanded details
router.post('/add-student-expanded', requireUser, uploadToS3.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]), handleUploadError, handleLocalFileUrls, async (req, res, next) => {
  try {


    // if (req.user.role !== 'parent') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only parents can access this endpoint'
    //   });
    // }

    const studentData = req.body;
    console.log('Student data:', JSON.stringify(studentData));

    // Check for required files
    if (!req.files || !req.files.idProof || req.files.idProof.length === 0) {
      console.log('Error: Missing required ID proof file');
      return res.status(400).json({
        success: false,
        message: 'Aadhaar/UAE ID is required'
      });
    }

    // Required fields validation
    if (!studentData.name || !studentData.dob || !studentData.gender) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, dob, and gender are required'
      });
    }

    // Validate file formats for photo
    if (req.files.photo && req.files.photo.length > 0) {
      const photoFile = req.files.photo[0];
      const validPhotoTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!validPhotoTypes.includes(photoFile.mimetype)) {
        console.error('Invalid photo format:', photoFile.mimetype);
        return res.status(400).json({
          success: false,
          message: 'Invalid file format for photo. Please upload a JPG or PNG image.'
        });
      }

      studentData.photo = photoFile.location;
      console.log('Photo file path:', studentData.photo);
    }

    // Validate file formats for ID proof
    if (req.files.idProof && req.files.idProof.length > 0) {
      const idProofFile = req.files.idProof[0];
      const validIdProofTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

      if (!validIdProofTypes.includes(idProofFile.mimetype)) {
        console.error('Invalid ID proof format:', idProofFile.mimetype);
        return res.status(400).json({
          success: false,
          message: 'Invalid file format for ID proof. Please upload a JPG, PNG image or PDF document.'
        });
      }
      studentData.idProof = idProofFile.location;
      console.log('ID Proof file path:', studentData.idProof);
    }

    // Check if Nationality ID (uid) already exists
    if (studentData.uid) {
      const existingStudent = await Student.findOne({ uid: studentData.uid });
      if (existingStudent) {
        console.log('Duplicate Nationality ID detected:', studentData.uid);
        return res.status(400).json({
          success: false,
          message: 'A student with this Nationality ID already exists. Please use a unique ID.'
        });
      }
    }

    // Convert string IDs to ObjectIDs and validate references
    try {
      // Handle sport assignment
      if (studentData.sport) {
        const Sport = require('../models/Sport');
        const sport = await Sport.findById(studentData.sport);
        if (!sport) {
          return res.status(400).json({
            success: false,
            message: 'Invalid sport selected'
          });
        }
        studentData.sport = sport._id;
      }

      // Handle age category
      if (studentData.ageCategory) {
        const AgeCategory = require('../models/AgeCategory');
        const ageCategory = await AgeCategory.findById(studentData.ageCategory);
        if (!ageCategory) {
          return res.status(400).json({
            success: false,
            message: 'Invalid age category selected'
          });
        }
        studentData.ageCategory = ageCategory._id;
      }

      // Handle distance
      if (studentData.distance) {
        const Distance = require('../models/Distance');
        const distance = await Distance.findById(studentData.distance);
        if (!distance) {
          return res.status(400).json({
            success: false,
            message: 'Invalid distance selected'
          });
        }
        studentData.distance = distance._id;
      }

      // Handle sport sub type
      if (studentData.sportSubType) {
        const SportSubType = require('../models/SportSubType');
        const subType = await SportSubType.findById(studentData.sportSubType);
        if (!subType) {
          return res.status(400).json({
            success: false,
            message: 'Invalid sport sub-type selected'
          });
        }
        studentData.sportSubType = subType._id;
      }

      // Create and save the student
      const student = new Student(studentData);
      const validationError = student.validateSync();
      if (validationError) {
        console.error('Validation error:', validationError);
        return res.status(400).json({
          success: false,
          message: `Validation failed: ${validationError.message}`
        });
      }

      await student.save();
      console.log('Student saved successfully with ID:', student._id);

      // Link the student to the parent
      const parentStudent = new ParentStudent({
        parent: req.user._id,
        student: student._id,
        relationship: studentData.relationship || 'parent'
      });

      await parentStudent.save();
      console.log('Student linked to parent successfully');

      // Return success response with populated student data
      const populatedStudent = await Student.findById(student._id)
        .populate('sport', 'name')
        .populate('ageCategory', 'ageGroup')
        .populate('distance', 'category value unit')
        .populate('sportSubType', 'type');

      return res.status(201).json({
        success: true,
        message: 'Student added successfully',
        student: populatedStudent
      });

    } catch (error) {
      console.error('Error processing student data:', error);
      return res.status(500).json({
        success: false,
        message: `Error processing student data: ${error.message}`
      });
    }

  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while adding the student'
    });
  }
});

// Parse student file for preview
router.post('/parse-student-file', requireUser, uploadBulkFiles.single('file'), async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== 'parent' && role !== 'school') {
      return res.status(403).json({
        success: false,
        message: 'Only parents and schools can parse student files'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const studentsData = await parseFileData(req.file);
    console.log('Total rows parsed:', studentsData.length);
    console.log('All parsed rows:');
    studentsData.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });

    const validRows = [];
    const errors = [];

    // Process all rows but skip header and instruction rows
    console.log('Processing all rows, filtering out header and instruction rows');

    for (let i = 0; i < studentsData.length; i++) {
      const studentData = studentsData[i];
      const rowNumber = i + 1; // Actual row number in Excel (1-based)

      console.log(`Processing row ${rowNumber}:`, studentData);

      // Skip instruction row (row 1) - has instructions in Sport/Distance columns
      if (rowNumber === 1 && studentData['Sport *'] && studentData['Sport *'].includes('Use exact sport name')) {
        console.log(`Skipping instruction row ${rowNumber}`);
        continue;
      }

      // Skip empty rows or rows that look like headers
      const hasData = Object.values(studentData).some(value => value && value.toString().trim() !== '');
      if (!hasData) {
        console.log(`Skipping empty row ${rowNumber}`);
        continue;
      }

      // Map Excel column names to expected field names
      const getFirstNonEmpty = (...values) => {
        for (const v of values) {
          if (v !== undefined && v !== null && String(v).trim() !== '') return String(v);
        }
        return '';
      };

      const getByFuzzyKey = (row, patterns) => {
        const keys = Object.keys(row);
        for (const pattern of patterns) {
          const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
          const key = keys.find(k => regex.test(k));
          if (key && String(row[key]).trim() !== '') return String(row[key]);
        }
        return '';
      };

      const dobValue = getFirstNonEmpty(
        studentData.dob,
        studentData['Date of Birth (DD-MMM-YYYY) *'],
        studentData['Date of Birth (YYYY-MM-DD) *'],
        studentData['Date of Birth'],
        getByFuzzyKey(studentData, [/date\s*of\s*birth/i, /^dob$/i, /\(dd\s*-?\s*mmm\s*-?\s*yyyy\)/i, /\(yyyy\s*-?\s*mm\s*-?\s*dd\)/i])
      );

      const mappedData = {
        name: studentData.name || studentData['Name *'] || studentData['Name'],
        uid: studentData.uid || studentData['UID *'] || studentData['UID'],
        dob: dobValue,
        gender: studentData.gender || studentData['Gender (male/female/other) *'] || studentData['Gender'],
        nationality: studentData.nationality || studentData['Nationality'],
        city: studentData.city || studentData['City'],
        represents: studentData.represents || studentData['Represents'],
        class: studentData.class || studentData['Class'],
        bloodGroup: studentData.bloodGroup || studentData['Blood Group'],
        relationship: studentData.relationship || studentData['Relationship'],
        medicalConditions: studentData.medicalConditions || studentData['Medical Conditions'],
        sport: studentData.sport || studentData['Sport *'] || studentData['Sport'],
        distance: studentData.distance || studentData['Distance *'] || studentData['Distance'],
        sportSubType: studentData.sportSubType || studentData['Sport Sub Type'],
        parentEmail: studentData.parentEmail || studentData['Parent Email'],
        parentName: studentData.parentName || studentData['Parent Name'],
        phoneNumber: studentData.phoneNumber || studentData['Parent Phone'] || '',
        countryCode: studentData.countryCode || studentData['Parent Country Code'] || ''
      };

      // Normalize fields
      if (mappedData.gender) mappedData.gender = String(mappedData.gender).trim().toLowerCase();
      if (mappedData.relationship) mappedData.relationship = String(mappedData.relationship).trim().toLowerCase();
      const bg = String(mappedData.bloodGroup || '').trim().toUpperCase();
      const validBG = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'];
      if (bg) {
        // Map common inputs like 'A' -> invalid, suggest? We'll coerce A to A+ if no sign specified
        mappedData.bloodGroup = validBG.includes(bg) ? bg : (['A', 'B', 'AB', 'O'].includes(bg) ? `${bg}+` : 'Unknown');
      }

      // Debug: Log the mapping for DOB field
      console.log(`Row ${rowNumber} DOB mapping:`, {
        original: studentData.dob,
        mapped: mappedData.dob,
        allKeys: Object.keys(studentData),
        dobKeys: Object.keys(studentData).filter(key => key.toLowerCase().includes('dob') || key.toLowerCase().includes('birth'))
      });

      const validationResult = validateStudentData(mappedData, rowNumber);
      const { errors: validationErrors, formattedDob } = validationResult;

      // Use formatted DOB if available
      if (formattedDob) {
        mappedData.dob = formattedDob;
      }

      if (validationErrors.length > 0) {
        errors.push({
          row: rowNumber,
          error: validationErrors.join(', '),
          ...mappedData
        });
      } else {
        // Validate sport, distance, and sport sub type exist in database
        const sportDistanceValidation = await validateSportDistanceData(mappedData, rowNumber);
        if (sportDistanceValidation.errors.length > 0) {
          errors.push({
            row: rowNumber,
            error: sportDistanceValidation.errors.join(', '),
            ...mappedData
          });
        } else {
          // Check if UID already exists
          const existingStudent = await Student.findOne({ uid: mappedData.uid });
          if (existingStudent) {
            errors.push({
              row: rowNumber,
              error: `Student with UID ${mappedData.uid} already exists`,
              ...mappedData
            });
          } else {
            validRows.push({
              ...mappedData,
              rowNumber
            });
          }
        }
      }
    }

    console.log('Validation results:', {
      totalRows: studentsData.length,
      validRows: validRows.length,
      errors: errors.length
    });

    res.json({
      success: true,
      message: 'File parsed successfully',
      data: {
        validRows,
        errors,
        totalRows: studentsData.length
      }
    });
  } catch (error) {
    console.error('File parsing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse file'
    });
  }
});

// Bulk upload students from Excel/CSV file
router.post('/bulk-upload-students', requireUser, uploadBulkFiles.single('file'), async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== 'parent' && role !== 'school') {
      return res.status(403).json({
        success: false,
        message: 'Only parents and schools can bulk upload students'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    let studentsData = [];

    // If confirmed data is provided, use it; otherwise parse the file
    if (req.body.confirmedData) {
      studentsData = JSON.parse(req.body.confirmedData);
    } else {
      studentsData = await parseFileData(req.file);
    }

    const results = {
      successCount: 0,
      errors: []
    };

    // Process each student
    for (let i = 0; i < studentsData.length; i++) {
      const studentData = studentsData[i];
      const rowNumber = studentData.rowNumber || i + 2;

      try {
        // Validate required fields
        if (!studentData.name || !studentData.uid) {
          results.errors.push({
            row: rowNumber,
            error: 'Name and UID are required fields'
          });
          continue;
        }

        // Check if UID already exists
        const existingStudent = await Student.findOne({ uid: studentData.uid });
        if (existingStudent) {
          results.errors.push({
            row: rowNumber,
            error: `Student with UID ${studentData.uid} already exists`
          });
          continue;
        }

        // Handle parent creation for school role
        let parentId = req.user._id;
        if (role === 'school') {
          if (!studentData.parentEmail || !studentData.parentName) {
            results.errors.push({
              row: rowNumber,
              error: 'Parent email and name are required for school uploads'
            });
            continue;
          }

          let parent = await User.findOne({ email: studentData.parentEmail });
          if (!parent) {
            parent = await UserService.create({
              email: studentData.parentEmail,
              name: studentData.parentName,
              role: 'parent',
              phoneNumber: studentData.phoneNumber || '',
              countryCode: studentData.countryCode || '',
              isActive: true
            });

            // Send welcome email to parent
            await EmailService.sendEmail(
              parent.email,
              'Welcome to the Student Registration System',
              "Your account has been created successfully!",
              `<div style="font-family: Arial, sans-serif;">
                <h2>Welcome, ${studentData.parentName}!</h2>
                <p>Your account has been created successfully. You can now manage your child's registration.</p>
              </div>`
            );
          }
          parentId = parent._id;
        }

        // Set default sport if not provided
        const defaultSport = await Sport.findOne();

        // Set sport (required)
        let sportId = null;
        if (studentData.sport) {
          // Try to find by ID or name
          if (mongoose.Types.ObjectId.isValid(studentData.sport)) {
            const sportById = await Sport.findById(studentData.sport);
            if (sportById) sportId = sportById._id;
          } else {
            const sportDoc = await Sport.findOne({
              name: { $regex: new RegExp(`^${studentData.sport}$`, 'i') },
              hide: { $ne: true }
            });
            if (sportDoc) sportId = sportDoc._id;
          }
        }
        if (!sportId) {
          results.errors.push({ row: rowNumber, error: `Invalid sport: "${studentData.sport}" not found in database` });
          continue;
        }

        // Set distance (conditionally required based on sport)
        let distanceId = null;

        // Check if the sport requires distances
        const sportDoc = await Sport.findById(sportId);
        if (sportDoc && sportDoc.distances && sportDoc.distances.length > 0) {
          // Sport requires distances
          if (!studentData.distance) {
            results.errors.push({
              row: rowNumber,
              error: `Distance is required for sport "${sportDoc.name}"`
            });
            continue;
          }

          // Validate the provided distance
          if (mongoose.Types.ObjectId.isValid(studentData.distance)) {
            const distanceById = await Distance.findById(studentData.distance);
            if (distanceById) distanceId = distanceById._id;
          } else {
            const distanceDoc = await Distance.findOne({
              category: { $regex: new RegExp(`^${studentData.distance}$`, 'i') }
            });
            if (distanceDoc) distanceId = distanceDoc._id;
          }

          if (!distanceId) {
            results.errors.push({
              row: rowNumber,
              error: `Invalid distance: "${studentData.distance}" not found in database`
            });
            continue;
          }
        } else {
          // Sport doesn't require distances
          if (studentData.distance && String(studentData.distance).trim()) {
            results.errors.push({
              row: rowNumber,
              error: `Sport "${sportDoc?.name || 'Unknown'}" does not require distances. Please remove distance field.`
            });
            continue;
          }
          // distanceId remains null for sports without distances
        }

        // Set sportSubType (conditionally required)
        let sportSubTypeId = null;
        const subTypes = await SportSubType.find({ sport: sportId });
        console.log(`Sport "${studentData.sport}" has ${subTypes.length} sub types:`, subTypes.map(st => st.type));
        if (subTypes.length > 0) {
          // sportSubType is required
          if (!studentData.sportSubType || !String(studentData.sportSubType).trim()) {
            const availableTypes = subTypes.map(st => st.type).join(', ');
            results.errors.push({
              row: rowNumber,
              error: `Sport sub type is required for this sport. Available options: ${availableTypes}`
            });
            continue;
          }

          // Try to find by ID first
          if (mongoose.Types.ObjectId.isValid(studentData.sportSubType)) {
            const subTypeById = await SportSubType.findOne({
              _id: studentData.sportSubType,
              sport: sportId
            });
            if (subTypeById) {
              sportSubTypeId = subTypeById._id;
            }
          }

          // If not found by ID, try case-insensitive name search
          if (!sportSubTypeId) {
            const trimmedSubType = String(studentData.sportSubType).trim();
            console.log(`Searching for sport sub type "${studentData.sportSubType}" (trimmed: "${trimmedSubType}")`);

            // Escape special regex characters
            const escapedSubType = trimmedSubType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const subTypeDoc = await SportSubType.findOne({
              sport: sportId,
              type: { $regex: new RegExp(`^${escapedSubType}$`, 'i') }
            });
            if (subTypeDoc) {
              sportSubTypeId = subTypeDoc._id;
              console.log(`✅ Found sport sub type "${subTypeDoc.type}" for "${studentData.sportSubType}"`);
            } else {
              console.log(`❌ No sport sub type found for "${studentData.sportSubType}"`);
            }
          }

          if (!sportSubTypeId) {
            const availableTypes = subTypes.map(st => st.type).join(', ');
            results.errors.push({
              row: rowNumber,
              error: `Invalid sport sub type "${studentData.sportSubType}" for the selected sport. Available options: ${availableTypes}`
            });
            continue;
          }
        }
        // If no sub types, leave sportSubTypeId null

        // Format DOB to DD-MMM-YYYY if needed
        let formattedDob = studentData.dob;
        if (studentData.dob && typeof studentData.dob === 'string') {
          // Use the same validation logic to format DOB
          const validationResult = validateStudentData({ dob: studentData.dob }, rowNumber);
          if (validationResult.formattedDob) {
            formattedDob = validationResult.formattedDob;
          }
        }

        // Auto-calculate ageCategory
        let ageCategoryId = null;
        if (formattedDob && sportId) {
          try {
            ageCategoryId = await calculateAgeCategory(formattedDob, sportId);
          } catch (err) {
            results.errors.push({ row: rowNumber, error: 'Failed to calculate age category: ' + err.message });
            continue;
          }
        } else {
          results.errors.push({ row: rowNumber, error: 'DOB and sport are required for age category calculation' });
          continue;
        }

        const processedStudentData = {
          name: studentData.name,
          uid: studentData.uid,
          dob: formattedDob || null,
          gender: studentData.gender || 'male',
          nationality: studentData.nationality || '',
          city: studentData.city || '',
          represents: studentData.represents || '',
          class: studentData.class || '',
          bloodGroup: studentData.bloodGroup || '',
          relationship: studentData.relationship || 'parent',
          medicalConditions: studentData.medicalConditions || '',
          sport: sportId,
          distance: distanceId,
          sportSubType: sportSubTypeId,
          ageCategory: ageCategoryId
        };

        // Create student
        const student = new Student(processedStudentData);
        await student.save();

        // Link student to parent
        const parentStudent = new ParentStudent({
          parent: parentId,
          student: student._id,
          school: role === 'school' ? req.user._id : null,
          relationship: processedStudentData.relationship || 'parent'
        });
        await parentStudent.save();
        console.log('ParentStudent link created:', {
          parent: parentId,
          student: student._id,
          school: role === 'school' ? req.user._id : null,
          relationship: processedStudentData.relationship || 'parent'
        });

        // Notify parent via email that the student was added
        try {
          const parentUserDoc = await User.findById(parentId).lean();
          if (parentUserDoc?.email) {
            const subject = 'Student profile created';
            const text = `Hello,\n\nA student profile has been created: ${studentData.name} (UID: ${studentData.uid}).\n\nYou can view details by logging into your account.`;
            const html = `
              <div style="font-family: Arial, sans-serif; line-height:1.6;">
                <h2>Student profile created</h2>
                <p><strong>${studentData.name}</strong> (UID: <strong>${studentData.uid}</strong>) has been added to your account.</p>
                <p>You can view details by logging in:</p>
                <p><a href="https://rovers.life/login" style="background:#4f46e5;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;display:inline-block;">Go to Dashboard</a></p>
              </div>`;
            await EmailService.sendEmail(parentUserDoc.email, subject, text, html);
          }
        } catch (emailErr) {
          console.error('Error sending student-created email to parent:', emailErr);
        }

        results.successCount++;
      } catch (error) {
        results.errors.push({
          row: rowNumber,
          error: error.message || 'Failed to process student data'
        });
      }
    }

    res.json({
      success: true,
      message: `Bulk upload completed. ${results.successCount} students uploaded successfully.`,
      results
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process bulk upload'
    });
    next(error);
  }
});

// Function to calculate age category based on DOB and sport
const calculateAgeCategory = async (dob, sportId) => {
  try {
    // Get the sport to find its start date
    const sport = await Sport.findById(sportId);
    if (!sport) {
      throw new Error('Sport not found');
    }

    // Calculate age at the time of sport event
    const dobDate = new Date(dob);
    const sportStartDate = sport.startDate ? new Date(sport.startDate) : new Date();

    // Calculate precise age considering month and day
    let ageAtEvent = sportStartDate.getFullYear() - dobDate.getFullYear();
    const monthDiff = sportStartDate.getMonth() - dobDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && sportStartDate.getDate() < dobDate.getDate())) {
      ageAtEvent--;
    }

    console.log(`Calculating age category: DOB=${dobDate.toISOString().split('T')[0]}, SportStart=${sportStartDate.toISOString().split('T')[0]}, AgeAtEvent=${ageAtEvent}`);

    // Get all age categories
    const ageCategories = await AgeCategory.find({}).sort({ ageGroup: 1 });
    console.log(`Found ${ageCategories.length} age categories:`, ageCategories.map(cat => cat.ageGroup));

    if (ageCategories.length === 0) {
      console.error('No age categories found in database');
      throw new Error('No age categories configured in the system');
    }

    // Find the appropriate age category
    for (const category of ageCategories) {
      // Parse age limit from category name (e.g., "Under 17" -> 17, "U17" -> 17, "17 and under" -> 17)
      const ageLimitMatch = category.ageGroup.match(/(?:Under\s+|U)(\d+)|(\d+)\s*(?:and\s*under|&\s*under)/i);
      if (ageLimitMatch) {
        const ageLimit = parseInt(ageLimitMatch[1] || ageLimitMatch[2], 10);
        console.log(`Checking category: ${category.ageGroup}, ageLimit: ${ageLimit}, studentAge: ${ageAtEvent}`);
        if (ageAtEvent <= ageLimit) {
          console.log(`Found matching age category: ${category.ageGroup} (limit: ${ageLimit})`);
          return category._id;
        }
      } else {
        console.log(`Could not parse age limit from category: ${category.ageGroup}`);
      }
    }

    // If no category found, return the highest age category
    const highestCategory = ageCategories[ageCategories.length - 1];
    console.log(`No specific category found for age ${ageAtEvent}, using highest: ${highestCategory?.ageGroup}`);
    return highestCategory?._id;
  } catch (error) {
    console.error('Error calculating age category:', error);
    throw error;
  }
};

// Route to get all sports for dropdown
router.get('/sports-options', requireUser, async (req, res, next) => {
  try {
    const sports = await Sport.find({ hide: { $ne: true } })
      .select('_id name description')
      .sort({ name: 1 });

    res.json({
      success: true,
      sports
    });
  } catch (error) {
    console.error('Error fetching sports options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sports options'
    });
  }
});

// Route to get distances for dropdown
router.get('/distances-options', requireUser, async (req, res, next) => {
  try {
    const distances = await Distance.find({})
      .select('_id category value unit')
      .sort({ value: 1 });

    res.json({
      success: true,
      distances
    });
  } catch (error) {
    console.error('Error fetching distances options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching distances options'
    });
  }
});

// Route to get sport sub types for a specific sport
router.get('/sport-subtypes-options/:sportId', requireUser, async (req, res, next) => {
  try {
    const { sportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sportId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sport ID'
      });
    }

    const sportSubTypes = await SportSubType.find({ sport: sportId })
      .select('_id type')
      .sort({ type: 1 });

    res.json({
      success: true,
      sportSubTypes
    });
  } catch (error) {
    console.error('Error fetching sport subtypes options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sport subtypes options'
    });
  }
});

// Route to get all age categories for dropdown
router.get('/age-categories-options', requireUser, async (req, res, next) => {
  try {
    const ageCategories = await AgeCategory.find({})
      .select('_id ageGroup')
      .sort({ ageGroup: 1 });

    res.json({
      success: true,
      ageCategories
    });
  } catch (error) {
    console.error('Error fetching age categories options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching age categories options'
    });
  }
});



module.exports = router;
