require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Student = require('../models/Student');
const Sport = require('../models/Sport');
const User = require('../models/User');
const Event = require('../models/Event');

async function checkRegistrations() {
    try {
        console.log('=== CHECKING REGISTRATIONS ===');

        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all registrations with populated fields
        const registrations = await Registration.find()
            .populate('student', 'name uid')
            .populate('sport', 'name')
            .populate('parent', 'name email')
            .populate('event', 'name')
            .sort({ createdAt: -1 });

        console.log(`\nFound ${registrations.length} registration records:`);
        console.log('==========================================');

        if (registrations.length === 0) {
            console.log('No registration records found in the database.');
        } else {
            registrations.forEach((reg, index) => {
                console.log(`\n${index + 1}. Registration ID: ${reg._id}`);
                console.log(`   Student: ${reg.student?.name || 'N/A'} (UID: ${reg.student?.uid || 'N/A'})`);
                console.log(`   Sport: ${reg.sport?.name || 'N/A'}`);
                console.log(`   Parent: ${reg.parent?.name || 'N/A'} (${reg.parent?.email || 'N/A'})`);
                console.log(`   Event: ${reg.event?.name || 'N/A'}`);
                console.log(`   Status: ${reg.status}`);
                console.log(`   Payment Status: ${reg.paymentStatus || 'N/A'}`);
                console.log(`   Payment Method: ${reg.paymentMethod || 'N/A'}`);
                console.log(`   Payment Intent ID: ${reg.paymentIntentId || 'N/A'}`);
                console.log(`   Payment Amount: ${reg.paymentAmount || 'N/A'} ${reg.paymentCurrency || ''}`);
                console.log(`   Country: ${reg.country || 'N/A'}`);
                console.log(`   Include Certification: ${reg.includeCertification || false}`);
                console.log(`   Registration Type: ${reg.registrationType || 'N/A'}`);
                console.log(`   Created At: ${reg.createdAt}`);
                console.log('   ---');
            });
        }

        // Also check recent payment intents and related data
        console.log('\n=== CHECKING RELATED DATA ===');

        const studentCount = await Student.countDocuments();
        const sportCount = await Sport.countDocuments();
        const userCount = await User.countDocuments();

        console.log(`Total Students: ${studentCount}`);
        console.log(`Total Sports: ${sportCount}`);
        console.log(`Total Users: ${userCount}`);

    } catch (error) {
        console.error('Error checking registrations:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

// Run the check function if this script is executed directly
if (require.main === module) {
    checkRegistrations();
}

module.exports = checkRegistrations; 