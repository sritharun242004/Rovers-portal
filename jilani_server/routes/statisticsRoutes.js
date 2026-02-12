const express = require('express');
const { requireUser } = require('./middleware/auth');
const StatisticsService = require('../services/statisticsService');

const router = express.Router();

router.get('/stats', requireUser, async (req, res,next) => {
  try {
    const stats = await StatisticsService.getAttendanceStats();
    return res.json(stats);
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;