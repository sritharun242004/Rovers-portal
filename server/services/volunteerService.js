const Volunteer = require('../models/Volunteer');

class VolunteerService {
  static async create(data, managerId) {
    try {
      // Check if volunteer with email already exists
      const existingVolunteer = await Volunteer.findOne({ email: data.email });
      if (existingVolunteer) {
        throw new Error('Volunteer with this email already exists');
      }

      // Create new volunteer
      const volunteer = new Volunteer({
        ...data,
        managerId
      });

      await volunteer.save();
      return volunteer;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async list(managerId) {
    try {
      return await Volunteer.find({ managerId });
    } catch (error) {
      throw new Error('Error fetching volunteers');
    }
  }
}

module.exports = VolunteerService;