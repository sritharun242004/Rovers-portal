const express = require('express');
const UserService = require('../services/userService.js');
const { requireUser } = require('./middleware/auth.js');
const mongoose = require('mongoose');
const User = require('../models/User.js');
const router = express.Router();

router.post('/register', requireUser, async (req, res,next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Only managers can register volunteers' });
  }

  try {
    const volunteerData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile,
      role: 'volunteer',
      checkpoint :req.body.checkpoint,
      managerId: new mongoose.Types.ObjectId(req.user._id)
    };


    const volunteer = await UserService.create(volunteerData);

    return res.status(200).json({
      success: true,
      volunteer: volunteer
    });
  } catch (error) {
    console.error('Error registering volunteer:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/', requireUser, async (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({
      success: false,
      message: 'Only managers can view volunteers'
    });
  }

  try {
    const volunteers = await User.find(
      { role: 'volunteer', managerId: req.user._id },
      'name email password'
    );
    return res.json({
      success: true,
      volunteers
    });
  } catch (error) {
    next(error);
    console.error('Error getting volunteers list:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;