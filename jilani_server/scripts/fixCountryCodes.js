const mongoose = require('mongoose');
const Event = require('../models/Event');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jilani', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function fixCountryCodes() {
    try {
        console.log('Connected to MongoDB');

        // Fix common incorrect country codes
        const fixes = [
            { from: 'Ind', to: 'india' },
            { from: 'IND', to: 'india' },
            { from: 'IN', to: 'india' },
            { from: 'US', to: 'malaysia' }, // You might want to change this mapping
            { from: 'GB', to: 'dubai' },    // You might want to change this mapping
            { from: 'UAE', to: 'dubai' },
            { from: 'MY', to: 'malaysia' },
            { from: 'Malaysia', to: 'malaysia' },
            { from: 'India', to: 'india' },
            { from: 'Dubai', to: 'dubai' }
        ];

        for (const fix of fixes) {
            const result = await Event.updateMany(
                { country: fix.from },
                { $set: { country: fix.to } }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Updated ${result.modifiedCount} events: "${fix.from}" → "${fix.to}"`);
            }
        }

        // Show current events and their countries
        const events = await Event.find({}, 'name country').sort({ name: 1 });
        console.log('\n📋 Current Events:');
        events.forEach(event => {
            const isValid = ['malaysia', 'dubai', 'india'].includes(event.country);
            const status = isValid ? '✅' : '❌';
            console.log(`${status} ${event.name}: "${event.country}"`);
        });

        // Show invalid country codes
        const invalidEvents = await Event.find({
            country: { $nin: ['malaysia', 'dubai', 'india'] }
        });

        if (invalidEvents.length > 0) {
            console.log('\n⚠️  Events with INVALID country codes:');
            invalidEvents.forEach(event => {
                console.log(`❌ ${event.name}: "${event.country}" (should be: malaysia, dubai, or india)`);
            });
        } else {
            console.log('\n✅ All events have valid country codes!');
        }

        console.log('\n✅ Country code fix completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing country codes:', error);
        process.exit(1);
    }
}

fixCountryCodes(); 