require('dotenv').config();
const mongoose = require('mongoose');
const SportLinkService = require('../services/sportLinkService');

async function linkSportData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    console.log('Starting sport linking process...');
    await SportLinkService.linkSportToData();
    console.log('Sport linking process completed successfully');
  } catch (error) {
    console.error('Error linking sports to data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  linkSportData().catch(console.error);
}

module.exports = linkSportData;