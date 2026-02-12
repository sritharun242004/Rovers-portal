const StatisticsService = require('../services/statisticsService');

let io;

function initialize(socketIo) {
  io = socketIo;
}

async function emitStatisticsUpdate() {
  if (!io) {
    console.error('Socket.IO not initialized');
    return;
  }

  try {
    const stats = await StatisticsService.getAttendanceStats();
    io.emit('statistics-update', stats);
  } catch (error) {
    console.error(error.stack);
  }
}

module.exports = {
  initialize,
  emitStatisticsUpdate
};