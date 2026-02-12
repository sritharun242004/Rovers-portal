const express = require('express');
const { requireUser } = require('./middleware/auth');
const SportService = require('../services/sportService');
const Sport = require('../models/Sport');
const Distance = require('../models/Distance');

const router = express.Router();

// Get all sports
router.get('/', async (req, res) => {
  try {
    const result = await SportService.getAllSports();
    return res.json(result);
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get sport by ID
router.get('/:id', async (req, res,next) => {
  try {
    const result = await SportService.getSportById(req.params.id);
    return res.json(result);
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get age categories for a sport
router.get('/:sportId/age-categories', async (req, res,next) => {
  try {
    const result = await SportService.getAgeCategoriesForSport(req.params.sportId);
    return res.json(result);
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get distances for a sport
router.get('/:sportId/distances', async (req, res,next) => {
  try {
    const sportId = req.params.sportId;

    // Find the sport
    const sport = await Sport.findById(sportId);
    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    // Get distances for the sport
    let distances = [];
    if (sport.distances && sport.distances.length > 0) {
      distances = await Distance.find({
        _id: { $in: sport.distances }
      });
    }

    // Log what's being sent back
    console.log(`Found ${distances.length} distances for sport ${sport.name}`);

    return res.json({
      success: true,
      distances
    });
  } catch (error) {
   next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get subtypes for a sport
router.get('/:sportId/subtypes', async (req, res,next) => {
  try {
    const result = await SportService.getSubTypesForSport(req.params.sportId);
    console.log(result , "result")
    return res.json(result);
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Calculate eligible age categories based on DOB and sport
router.post('/eligible-age-categories', requireUser, async (req, res,next) => {
  try {
    const { dob, sportId } = req.body;

    if (!dob || !sportId) {
      console.log('Missing required parameters:', { dob, sportId });
      return res.status(400).json({
        success: false,
        message: 'Date of birth and sport ID are required'
      });
    }

    // Convert DOB string to Date object
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      console.log('Invalid DOB format:', dob);
      return res.status(400).json({
        success: false,
        message: 'Invalid date of birth format'
      });
    }

    // Find the sport to get its start date
    const sport = await Sport.findById(sportId);
    if (!sport) {
      console.log('Sport not found with ID:', sportId);
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    // Get all age categories for this sport
    const sportWithCategories = await Sport.findById(sportId)
      .populate('ageCategories')
      .lean();

    if (!sportWithCategories || !sportWithCategories.ageCategories) {
      console.log('No age categories found for sport:', sportId);
      return res.json({
        success: true,
        eligibleCategories: []
      });
    }

    const allCategories = sportWithCategories.ageCategories;

    // Calculate age at sport start date
    const sportStartDate = sport.startDate ? new Date(sport.startDate) : new Date();
    const ageAtSportDate = sportStartDate.getFullYear() - dobDate.getFullYear();

    console.log('DOB:', dobDate, 'Sport start date:', sportStartDate, 'Age at sport date:', ageAtSportDate);

    // Filter categories based on age
    const eligibleCategories = allCategories.filter(category => {
      // Extract age limit from category name (e.g., "Under 11" -> 11)
      const ageLimitMatch = category.ageGroup.match(/Under\s+(\d+)/i);
      if (!ageLimitMatch) return true; // If format doesn't match, include it to be safe

      const ageLimit = parseInt(ageLimitMatch[1], 10);

      // Student is eligible if their age is LESS than the category limit
      const isEligible = ageAtSportDate < ageLimit;
      console.log(`Category: ${category.ageGroup}, Age limit: ${ageLimit}, Eligible: ${isEligible}`);

      return isEligible;
    });

    console.log('Eligible categories:', eligibleCategories.map(c => c.ageGroup));

    return res.json({
      success: true,
      eligibleCategories
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;