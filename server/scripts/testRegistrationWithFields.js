require('dotenv').config();
const mongoose = require('mongoose');
const RegistrationService = require('../services/registrationService');
const User = require('../models/User');
const Student = require('../models/Student');
const Sport = require('../models/Sport');
const AgeCategory = require('../models/AgeCategory');
const Distance = require('../models/Distance');
const SportSubType = require('../models/SportSubType');

async function testRegistrationWithFields() {
    try {
        console.log('=== TESTING REGISTRATION WITH REQUIRED FIELDS ===');

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

        // Find a test sport
        const testSport = await Sport.findOne();
        if (!testSport) {
            console.log('No sports found for testing');
            return;
        }
        console.log(`Using test sport: ${testSport.name}`);

        // Find age categories, distances, and sport sub types for this sport
        const [ageCategories, distances, sportSubTypes] = await Promise.all([
            AgeCategory.find().limit(3),
            Distance.find().limit(3),
            SportSubType.find().limit(3)
        ]);

        console.log(`Available age categories: ${ageCategories.map(ac => ac.ageGroup).join(', ')}`);
        console.log(`Available distances: ${distances.map(d => `${d.category} (${d.value}${d.unit})`).join(', ')}`);
        console.log(`Available sport sub types: ${sportSubTypes.map(st => st.type).join(', ')}`);

        // Find some test students
        const testStudents = await Student.find().limit(2);
        if (testStudents.length === 0) {
            console.log('No students found for testing');
            return;
        }
        console.log(`Using test students: ${testStudents.map(s => s.name).join(', ')}`);

        // Test registration with all required fields
        const mockPaymentIntent = {
            id: 'pi_test_with_fields_' + Date.now(),
            amount: 30000, // 300.00 INR
            currency: 'inr',
            status: 'succeeded',
            metadata: {
                studentIds: JSON.stringify(testStudents.map(s => s._id.toString())),
                country: 'india',
                includeCertification: 'true',
                sportId: testSport._id.toString(),
                eventId: '',
                ageCategoryId: ageCategories.length > 0 ? ageCategories[0]._id.toString() : '',
                distanceId: distances.length > 0 ? distances[0]._id.toString() : '',
                sportSubTypeId: sportSubTypes.length > 0 ? sportSubTypes[0]._id.toString() : '',
                userId: testUser._id.toString(),
                userEmail: testUser.email
            }
        };

        console.log('\nMock Payment Intent with required fields:', {
            id: mockPaymentIntent.id,
            amount: mockPaymentIntent.amount,
            currency: mockPaymentIntent.currency,
            status: mockPaymentIntent.status,
            ageCategoryId: mockPaymentIntent.metadata.ageCategoryId,
            distanceId: mockPaymentIntent.metadata.distanceId,
            sportSubTypeId: mockPaymentIntent.metadata.sportSubTypeId,
            studentCount: JSON.parse(mockPaymentIntent.metadata.studentIds).length
        });

        // Test the registration creation logic
        console.log('\n=== CREATING REGISTRATIONS WITH REQUIRED FIELDS ===');

        const studentIds = JSON.parse(mockPaymentIntent.metadata.studentIds);
        const { country, includeCertification, eventId, sportId, ageCategoryId, distanceId, sportSubTypeId } = mockPaymentIntent.metadata;

        const registrationResults = [];

        for (const studentId of studentIds) {
            try {
                const registrationData = {
                    studentId,
                    studentIds: [studentId],
                    sportId,
                    eventId: eventId || null,
                    ageCategoryId: ageCategoryId || null,
                    distanceId: distanceId || null,
                    sportSubTypeId: sportSubTypeId || null,
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

                console.log(`Creating registration for student ${studentId} with fields:`, {
                    ageCategoryId: registrationData.ageCategoryId,
                    distanceId: registrationData.distanceId,
                    sportSubTypeId: registrationData.sportSubTypeId
                });

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
        }).populate('student', 'name').populate('sport', 'name').populate('ageCategory', 'ageGroup').populate('distance', 'category').populate('sportSubType', 'type');

        console.log(`Found ${createdRegistrations.length} registrations in database:`);
        createdRegistrations.forEach(reg => {
            console.log(`- ${reg.student?.name} for ${reg.sport?.name}`);
            console.log(`  Age Category: ${reg.ageCategory?.ageGroup || 'N/A'}`);
            console.log(`  Distance: ${reg.distance?.category || 'N/A'}`);
            console.log(`  Sport Sub Type: ${reg.sportSubType?.type || 'N/A'}`);
            console.log(`  Payment: ${reg.paymentStatus}, Amount: ${reg.paymentAmount} ${reg.paymentCurrency}`);
            console.log('  ---');
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
    testRegistrationWithFields();
}

module.exports = testRegistrationWithFields; 