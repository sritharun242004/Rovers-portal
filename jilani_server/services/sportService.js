const Sport = require('../models/Sport');
const AgeCategory = require('../models/AgeCategory');
const Distance = require('../models/Distance');
const SportSubType = require('../models/SportSubType');

class SportService {
  // Get all sports with extra fields
  static async getAllSports() {
    try {
      const sports = await Sport.find({ hide: false }).lean();
      return { sports };
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw new Error(`Failed to fetch sports: ${error.message}`);
    }
  }

  // Get sport by ID with all related data
  static async getSportById(sportId) {
    try {
      const sport = await Sport.findById(sportId)
        .populate('ageCategories', 'ageGroup')
        .populate('distances', 'category value unit')
        .populate('sportSubTypes', 'type')
        .lean();
      
      if (!sport) {
        throw new Error(`Sport with ID ${sportId} not found`);
      }
      return { sport };
    } catch (error) {
      console.error(`Error fetching sport with ID ${sportId}:`, error);
      throw new Error(`Failed to fetch sport: ${error.message}`);
    }
  }

  // Get age categories for a sport
  static async getAgeCategoriesForSport(sportId) {
    try {
      const sport = await Sport.findById(sportId).lean();
      if (!sport) {
        throw new Error(`Sport with ID ${sportId} not found`);
      }

      if (!sport.ageCategories || sport.ageCategories.length === 0) {
        return { ageCategories: [] };
      }

      const ageCategories = await AgeCategory.find({
        _id: { $in: sport.ageCategories }
      }).lean();

      return { ageCategories };
    } catch (error) {
      console.error(`Error fetching age categories for sport ${sportId}:`, error);
      throw new Error(`Failed to fetch age categories: ${error.message}`);
    }
  }

  // Get distances for a sport
  static async getDistancesForSport(sportId) {
    try {
      const sport = await Sport.findById(sportId).lean();
      if (!sport) {
        throw new Error(`Sport with ID ${sportId} not found`);
      }

      if (!sport.distances || sport.distances.length === 0) {
        return { distances: [] };
      }

      const distances = await Distance.find({
        _id: { $in: sport.distances }
      }).lean();

      return { distances };
    } catch (error) {
      console.error(`Error fetching distances for sport ${sportId}:`, error);
      throw new Error(`Failed to fetch distances: ${error.message}`);
    }
  }

  // Get subtypes for a sport
  static async getSubTypesForSport(sportId) {
    try {

     
      const sport = await Sport.findById(sportId).lean();
      if (!sport) {
        throw new Error(`Sport with ID ${sportId} not found`);
      }

      if (!sport.sportSubTypes || sport.sportSubTypes.length === 0) {
        return { subtypes: [] };
      }

      const subtypes = await SportSubType.find({
        _id: { $in: sport.sportSubTypes }
      }).lean();
      return { subtypes };
    } catch (error) {
      console.error(`Error fetching subtypes for sport ${sportId}:`, error);
      throw new Error(`Failed to fetch subtypes: ${error.message}`);
    }
  }
}

module.exports = SportService;