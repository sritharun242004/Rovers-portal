require('dotenv').config();
const mongoose = require('mongoose');
const PaymentService = require('../services/paymentService');
const RegistrationService = require('../services/registrationService');
const User = require('../models/User');
const Student = require('../models/Student');
const Sport = require('../models/Sport');

async function testPaymentConfirmation() {
    try {
        console.log('=== TESTING PAYMENT CONFIRMATION ===');

        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find a test user (parent)
        const testUser = await User.findOne({ role: 'parent' }).limit(1);
        if (!testUser) {
            console.log('No parent user found for testing');
            return;
        }

        console.log(`Using test user: ${testUser.name} (${testUser.email})`);

        // Find some test students
        const testStudents = await Student.find().limit(2);
        if (testStudents.length === 0) {
            console.log('No students found for testing');
            return;
        }

        console.log(`Using test students: ${testStudents.map(s => s.name).join(', ')}`);

        // Find a test sport
        const testSport = await Sport.findOne();
        if (!testSport) {
            console.log('No sports found for testing');
            return;
        }

        console.log(`Using test sport: ${testSport.name}`);

        // Create a mock payment intent with metadata
        const mockPaymentIntent = {
            id: 'pi_test_' + Date.now(),
            amount: 30000, // 300.00 INR
            currency: 'inr',
            status: 'succeeded',
            metadata: {
                studentIds: JSON.stringify(testStudents.map(s => s._id.toString())),
                country: 'india',
                includeCertification: 'true',
                sportId: testSport._id.toString(),
                eventId: '',
                userId: testUser._id.toString(),
                userEmail: testUser.email
            }
        };

        console.log('\nMock Payment Intent:', {
            id: mockPaymentIntent.id,
            amount: mockPaymentIntent.amount,
            currency: mockPaymentIntent.currency,
            status: mockPaymentIntent.status,
            studentCount: JSON.parse(mockPaymentIntent.metadata.studentIds).length
        });

        // Test the registration creation logic
        console.log('\n=== CREATING REGISTRATIONS ===');

        const studentIds = JSON.parse(mockPaymentIntent.metadata.studentIds);
        const { country, includeCertification, eventId, sportId } = mockPaymentIntent.metadata;

        const registrationResults = [];

        for (const studentId of studentIds) {
            try {
                const registrationData = {
                    studentId,
                    studentIds: [studentId],
                    sportId,
                    eventId: eventId || null,
                    paymentIntentId: mockPaymentIntent.id,
                    paymentStatus: mockPaymentIntent.amount > 0 ? 'paid' : 'free',
                    paymentMethod: 'stripe',
                    paymentAmount: mockPaymentIntent.amount,
                    paymentCurrency: mockPaymentIntent.currency,
                    country,
                    includeCertification: includeCertification === 'true',
                    registrationType: 'online_payment',
                    transactionId: mockPaymentIntent.id
                };

                console.log(`Creating registration for student ${studentId}...`);

                const result = await RegistrationService.registerStudentForSport(
                    testUser._id,
                    registrationData
                );

                registrationResults.push({
                    studentId,
                    success: true,
                    registration: result
                });

                console.log(`✅ Successfully registered student ${studentId}`);
            } catch (error) {
                console.error(`❌ Failed to register student ${studentId}:`, error.message);
                registrationResults.push({
                    studentId,
                    success: false,
                    error: error.message
                });
            }
        }

        // Summary
        const successfulRegistrations = registrationResults.filter(r => r.success);
        const failedRegistrations = registrationResults.filter(r => !r.success);

        console.log('\n=== RESULTS ===');
        console.log(`Successful registrations: ${successfulRegistrations.length}`);
        console.log(`Failed registrations: ${failedRegistrations.length}`);

        if (failedRegistrations.length > 0) {
            console.log('\nFailed registrations:');
            failedRegistrations.forEach(r => {
                console.log(`- Student ${r.studentId}: ${r.error}`);
            });
        }

        console.log('\n=== VERIFICATION ===');
        // Check if registrations were actually created
        const Registration = require('../models/Registration');
        const createdRegistrations = await Registration.find({
            paymentIntentId: mockPaymentIntent.id
        }).populate('student', 'name').populate('sport', 'name');

        console.log(`Found ${createdRegistrations.length} registrations in database:`);
        createdRegistrations.forEach(reg => {
            console.log(`- ${reg.student?.name} for ${reg.sport?.name} (Payment: ${reg.paymentStatus}, Amount: ${reg.paymentAmount} ${reg.paymentCurrency})`);
        });

    } catch (error) {
        console.error('Error in test:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

// Run the test function if this script is executed directly
if (require.main === module) {
    testPaymentConfirmation();
}

module.exports = testPaymentConfirmation; 