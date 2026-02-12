require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Student = require('../models/Student');
const Sport = require('../models/Sport');
const User = require('../models/User');
const Event = require('../models/Event');

async function checkPaidRegistrations() {
    try {
        console.log('=== CHECKING PAID REGISTRATIONS ===');

        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all paid registrations
        const paidRegistrations = await Registration.find({
            paymentStatus: { $in: ['paid', 'free'] },
            paymentMethod: 'stripe'
        })
            .populate('student', 'name uid')
            .populate('sport', 'name')
            .populate('parent', 'name email')
            .populate('event', 'name')
            .sort({ createdAt: -1 });

        console.log(`\nFound ${paidRegistrations.length} paid/stripe registration records:`);
        console.log('==========================================');

        if (paidRegistrations.length === 0) {
            console.log('No paid registration records found in the database.');
        } else {
            paidRegistrations.forEach((reg, index) => {
                console.log(`\n${index + 1}. Registration ID: ${reg._id}`);
                console.log(`   Student: ${reg.student?.name || 'N/A'} (UID: ${reg.student?.uid || 'N/A'})`);
                console.log(`   Sport: ${reg.sport?.name || 'N/A'}`);
                console.log(`   Parent: ${reg.parent?.name || 'N/A'} (${reg.parent?.email || 'N/A'})`);
                console.log(`   Event: ${reg.event?.name || 'N/A'}`);
                console.log(`   Status: ${reg.status}`);
                console.log(`   Payment Status: ${reg.paymentStatus}`);
                console.log(`   Payment Method: ${reg.paymentMethod}`);
                console.log(`   Payment Intent ID: ${reg.paymentIntentId || 'N/A'}`);
                console.log(`   Payment Amount: ${reg.paymentAmount || 'N/A'} ${reg.paymentCurrency || ''}`);
                console.log(`   Country: ${reg.country || 'N/A'}`);
                console.log(`   Include Certification: ${reg.includeCertification || false}`);
                console.log(`   Registration Type: ${reg.registrationType || 'N/A'}`);
                console.log(`   Created At: ${reg.createdAt}`);
                console.log('   ---');
            });
        }

        // Summary statistics
        console.log('\n=== SUMMARY ===');
        const totalPaid = await Registration.countDocuments({ paymentStatus: 'paid' });
        const totalFree = await Registration.countDocuments({ paymentStatus: 'free' });
        const totalStripe = await Registration.countDocuments({ paymentMethod: 'stripe' });
        const totalOnlinePayment = await Registration.countDocuments({ registrationType: 'online_payment' });

        console.log(`Total Paid Registrations: ${totalPaid}`);
        console.log(`Total Free Registrations: ${totalFree}`);
        console.log(`Total Stripe Registrations: ${totalStripe}`);
        console.log(`Total Online Payment Registrations: ${totalOnlinePayment}`);

    } catch (error) {
        console.error('Error checking paid registrations:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

// Run the check function if this script is executed directly
if (require.main === module) {
    checkPaidRegistrations();
}

module.exports = checkPaidRegistrations; 