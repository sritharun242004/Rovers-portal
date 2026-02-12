const express = require('express');
const router = express.Router();
const os = require('os');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

/**
 * @route GET /api/diagnostics/system
 * @desc Get system diagnostic information
 * @access Public
 */
router.get('/system', (req, res) => {
  try {
    console.log('Getting system diagnostics');
    const systemInfo = {
      timestamp: new Date().toISOString(),
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
      os: {
        type: os.type(),
        release: os.release(),
        platform: os.platform(),
        hostname: os.hostname(),
        uptime: os.uptime(),
        loadAvg: os.loadavg(),
        totalMem: os.totalmem(),
        freeMem: os.freemem(),
        cpus: os.cpus().length,
      },
      process: {
        cwd: process.cwd(),
        execPath: process.execPath,
        env: {
          NODE_ENV: process.env.NODE_ENV,
        },
      }
    };

    console.log('System diagnostics retrieved successfully');
    res.json(systemInfo);
  } catch (error) {
    console.error('Error getting system diagnostics:', error);
    res.status(500).json({ error: 'Failed to get system diagnostics', message: error.message });
  }
});

/**
 * @route GET /api/diagnostics/database
 * @desc Get database connection status and information
 * @access Public
 */
router.get('/database', async (req, res) => {
  try {
    console.log('Getting database diagnostics');
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: [],
    };

    if (dbStatus.connected) {
      // Get collections if connected
      const collections = await mongoose.connection.db.listCollections().toArray();
      dbStatus.collections = collections.map(c => c.name);

      // Get counts for collections
      for (const collName of dbStatus.collections) {
        dbStatus[collName + '_count'] = await mongoose.connection.db.collection(collName).countDocuments();
      }
      console.log(`Database connected. Found ${dbStatus.collections.length} collections.`);
    } else {
      console.log('Database not connected');
    }

    res.json(dbStatus);
  } catch (error) {
    console.error('Error getting database diagnostics:', error);
    res.status(500).json({ error: 'Failed to get database diagnostics', message: error.message });
  }
});

/**
 * @route GET /api/diagnostics/health
 * @desc Health check endpoint with basic server status
 * @access Public
 */
router.get('/health', (req, res) => {
  try {
    console.log('Performing health check');
    const healthData = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        connected: mongoose.connection.readyState === 1,
        state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
      }
    };

    if (healthData.database.connected) {
      console.log('Health check successful: System is UP');
      res.json(healthData);
    } else {
      console.error('Health check failed: Database not connected');
      healthData.status = 'DOWN';
      res.status(503).json(healthData);
    }
  } catch (error) {
    console.error('Error during health check:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      error: 'Failed to perform health check', 
      message: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;