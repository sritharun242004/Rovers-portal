const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Sport = require('../models/Sport');

const updateAthleticsImage = async () => {
  try {
    console.log('🔄 Connecting to database...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Not found');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }
    
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to database successfully');

    const newImage = 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/portal/WhatsApp+Image+2025-11-18+at+22.57.36.jpeg';

    // Update Athletics sport image
    const result = await Sport.updateOne(
      { name: 'Athletics' },
      { 
        $set: { 
          image: newImage 
        } 
      }
    );

    if (result.matchedCount === 0) {
      console.log('⚠️  Athletics sport not found in database');
    } else if (result.modifiedCount === 0) {
      console.log('ℹ️  Athletics already has this image');
    } else {
      console.log('✅ Athletics image updated successfully!');
      console.log(`   New image: ${newImage}`);
    }

    // Verify the update
    const athletics = await Sport.findOne({ name: 'Athletics' });
    if (athletics) {
      console.log('\n📋 Current Athletics data:');
      console.log(`   Name: ${athletics.name}`);
      console.log(`   Image: ${athletics.image}`);
    }

  } catch (error) {
    console.error('❌ Error updating athletics image:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
    process.exit(0);
  }
};

// Run the update
updateAthleticsImage();

