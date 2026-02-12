const express = require('express');
const { requireUser } = require('./middleware/auth');
const AttendanceService = require('../services/attendanceService');

const router = express.Router();

router.post('/verify', requireUser, async (req, res,next) => {
  try {
    const { studentId, checkpoint, location } = req.body;
    console.log("req.body",req.body)
    const result = await AttendanceService.verifyAndRecordAttendance({
      studentId,
      checkpoint,
      location,
      volunteerId: req.user._id
    });
    return res.json(result);
  } catch (error) {
    next(error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;