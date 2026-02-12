const { randomUUID } = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User.js');
const UserSport = require('../models/UserSport.js');
const { generatePasswordHash, validatePassword } = require('../utils/password.js');
const EmailService = require('../utils/email.js');

class UserService {
  static async list() {
    try {
      return User.find();
    } catch (err) {
      throw new Error(`Database error while listing users: ${err}`);
    }
  }

  static async get(id) {
    try {
      return User.findOne({ _id: id }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their ID: ${err}`);
    }
  }

  static async getByEmail(email) {
    try {
      return User.findOne({ email }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their email: ${err}`);
    }
  }
  static async checkTemporarayUser(email) {
    try {
      return User.findOne({email ,role : "temporary"})
    } catch (error) {
      throw new Error(`Database error while getting the user by their email: ${err}`);
    }
  }

  static async update(id, data) {
    try {
      return User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
    } catch (err) {
      throw new Error(`Database error while updating user ${id}: ${err}`);
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return (result.deletedCount === 1);
    } catch (err) {
      throw new Error(`Database error while deleting user ${id}: ${err}`);
    }
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    try {
      // Use lean() to get a plain JavaScript object without Mongoose validation
      const user = await User.findOne({ email }).lean().exec();
      if (!user) return null;

      // Compare hashed passwords using bcrypt
      const isValid = await validatePassword(password, user.password);
      if (!isValid) {
        return null;
      }

      // Update last login without triggering validation
      await User.updateOne(
        { _id: user._id },
        { lastLoginAt: Date.now() }
      );
      return user;
    } catch (err) {
      throw new Error(`Database error while authenticating user ${email} with password: ${err}`);
    }
  }

  // Generate a unique 8-character code for schools
  static generateUniqueCode() {
    // Generate a random string of 8 characters (letters and numbers)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static async create(userData) {
    try {
      if (!userData.email) throw new Error('Email is required');
      if (!userData.name) throw new Error('Name is required');
      if (!userData.role) throw new Error('Role is required');

      // Validate role
      if (!['manager', 'volunteer', 'parent', 'school'].includes(userData.role)) {
        throw new Error('Invalid role');
      }

      // Check if temporary user exists with this email
      const existingUser = await User.findOne({ email: userData.email });
      let user;

      if (existingUser && existingUser.role === 'temporary') {
        // Update the temporary user instead of creating a new one
        // Update basic fields
        existingUser.name = userData.name;
        existingUser.role = userData.role;
        existingUser.isActive = true;

        // Hash password if provided
        if (userData.password) {
          existingUser.password = await generatePasswordHash(userData.password);
        }

        // Add role-specific fields
        if (userData.role === 'parent') {
          existingUser.phoneNumber = userData.phoneNumber;
          existingUser.countryCode = userData.countryCode;
        } else if (userData.role === 'school') {
          // Generate unique code for school
          const uniqueCode = this.generateUniqueCode();
          existingUser.uniqueCode = uniqueCode;
          existingUser.schoolType = userData.schoolType;
          existingUser.contactPersonName = userData.contactPersonName;
          existingUser.contactPersonPhone = userData.contactPersonPhone;
          existingUser.countryCode = userData.countryCode;
          existingUser.address = userData.address;
          existingUser.provideVenue = userData.provideVenue;

          // Send email with unique code
          await EmailService.sendEmail(
            userData.email,
            'School Registration - Unique Code',
            'Your School Registration Code',
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <h2 style="color: #333;">School Registration Successful!</h2>
              <p>Dear ${userData.name},</p>
              <p>Your school has been successfully registered. Here is your unique school code:</p>
              <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
                ${uniqueCode}
              </div>
              <p>Please keep this code safe as it will be used for future reference and verification purposes.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <hr style="margin: 20px 0;">
              <p style="font-size: 0.95em; color: #555;">
                <em>Note:</em> This is an automated message. Please do not reply to this email.
              </p>
            </div>`
          );
        }

        user = await existingUser.save();
      } else if (existingUser) {
        // If user exists but is not temporary, throw error
        throw new Error('User with this email already exists');
      } else {
        // Create new user
        const newUserData = {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          password: userData.password ? await generatePasswordHash(userData.password) : '',
          managerId: userData.managerId,
          checkpoint: userData.checkpoint,
          isActive: true
        };

        // Add role-specific fields
        if (userData.role === 'parent') {
          newUserData.phoneNumber = userData.phoneNumber;
          newUserData.countryCode = userData.countryCode;
        } else if (userData.role === 'school') {
          // Generate unique code for school
          const uniqueCode = this.generateUniqueCode();
          newUserData.uniqueCode = uniqueCode;
          newUserData.schoolType = userData.schoolType;
          newUserData.contactPersonName = userData.contactPersonName;
          newUserData.contactPersonPhone = userData.contactPersonPhone;
          newUserData.countryCode = userData.countryCode;
          newUserData.address = userData.address;
          newUserData.provideVenue = userData.provideVenue;

          // Send email with unique code
          await EmailService.sendEmail(
            userData.email,
            'School Registration - Unique Code',
            'Your School Registration Code',
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <h2 style="color: #333;">School Registration Successful!</h2>
              <p>Dear ${userData.contactPersonName},</p>
              <p>Your school has been successfully registered. Here is your unique school code:</p>
              <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
                ${uniqueCode}
              </div>
              <p>Please keep this code safe as it will be used for future reference and verification purposes.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <hr style="margin: 20px 0;">
              <p style="font-size: 0.95em; color: #555;">
                <em>Note:</em> This is an automated message. Please do not reply to this email.
              </p>
            </div>`
          );
        }

        user = new User(newUserData);
        await user.save();
      }

      // If it's a school and sports are provided, create the UserSport mappings
      if (userData.role === 'school' && userData.sports && Array.isArray(userData.sports)) {
        // Remove any existing sport mappings if updating a user
        if (existingUser) {
          await UserSport.deleteMany({ user: user._id });
        }

        const sportPromises = userData.sports.map(sportId => {
          return new UserSport({
            user: user._id,
            sport: sportId
          }).save();
        });

        await Promise.all(sportPromises);
      }

      return user;
    } catch (err) {
      throw new Error(`Database error while creating/updating user: ${err.message}`);
    }
  }

  static async setPassword(user, password) {
    if (!password) throw new Error('Password is required');
    user.password = await generatePasswordHash(password);

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw new Error(`Database error while setting user password: ${err}`);
    }
  }

  // Get sports for a school user
  static async getUserSports(userId) {
    try {
      const userSports = await UserSport.find({ user: userId })
        .populate('sport', 'name')
        .lean();

      return userSports.map(us => us.sport);
    } catch (err) {
      console.error(`Error getting user sports: ${err}`);
      throw new Error(`Database error while getting user sports: ${err}`);
    }
  }

  // Find a school by its unique code
  static async findSchoolByUniqueCode(uniqueCode) {
    try {
      const school = await User.findOne({
        uniqueCode,
        role: 'school'
      });
      
      return school;
    } catch (err) {
      console.error(`Error finding school by unique code: ${err}`);
      throw new Error(`Database error while finding school by unique code: ${err}`);
    }
  }

  // Add sports to a school user
  static async addUserSports(userId, sportIds) {
    try {
      const sportPromises = sportIds.map(sportId => {
        return new UserSport({
          user: userId,
          sport: sportId
        }).save();
      });

      await Promise.all(sportPromises);
      return true;
    } catch (err) {
      console.error(`Error adding user sports: ${err}`);
      throw new Error(`Database error while adding user sports: ${err}`);
    }
  }
}

module.exports = UserService;