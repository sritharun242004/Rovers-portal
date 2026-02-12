const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Sport = require('../models/Sport');

// Sport pricing in Ringgit (MYR) - stored in cents
const SPORT_PRICING = {
  'Skating': 10000,      // RM 100
  'Badminton': 10000,    // RM 100
  'Taekwondo': 10000,    // RM 100
  'Karate': 15000,       // RM 150
  'Silambam': 10000,     // RM 100
  'Athletics': 3000,     // RM 30
  'Football': 30000,     // RM 300
  'Cricket': 30000,      // RM 300
};

const updateSportPricing = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to database successfully\n');

    console.log('Updating sport pricing...');
    console.log('═══════════════════════════════════════\n');

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const [sportName, priceInCents] of Object.entries(SPORT_PRICING)) {
      const priceInRinggit = priceInCents / 100;
      
      // Try to find the sport (case-insensitive)
      const sport = await Sport.findOne({ 
        name: { $regex: new RegExp(`^${sportName}$`, 'i') } 
      });

      if (sport) {
        sport.registrationFee = priceInCents;
        await sport.save();
        console.log(`✅ ${sportName.padEnd(15)} → RM ${priceInRinggit.toFixed(2)} (${priceInCents} cents)`);
        updatedCount++;
      } else {
        console.log(`⚠️  ${sportName.padEnd(15)} → Sport not found in database`);
        notFoundCount++;
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updatedCount} sports`);
    console.log(`   ⚠️  Not found: ${notFoundCount} sports`);
    
    if (notFoundCount > 0) {
      console.log(`\n💡 Tip: Sports not found need to be created first.`);
      console.log(`   Available sports in database:`);
      const allSports = await Sport.find().select('name registrationFee');
      allSports.forEach(s => {
        const fee = s.registrationFee || 0;
        console.log(`   - ${s.name} (RM ${(fee / 100).toFixed(2)})`);
      });
    }

    console.log('\n✨ Sport pricing update completed!\n');
  } catch (error) {
    console.error('❌ Error updating sport pricing:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the update function
if (require.main === module) {
  updateSportPricing();
}

module.exports = updateSportPricing;

