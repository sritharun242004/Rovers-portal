require('dotenv').config();
const mongoose = require('mongoose');
const Sport = require('../models/Sport');
const Student = require('../models/Student');

const seedDatabase = async () => {
  try {


    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    

    // Clear existing data
    await Sport.deleteMany({});
    await Student.deleteMany({});
   

    // Insert sports
    const sports = await Sport.insertMany([
      { name: 'Basketball' },
      { name: 'Soccer' }
    ]);


    // Get sport references
    const basketball = sports.find(s => s.name === 'Basketball');
    const soccer = sports.find(s => s.name === 'Soccer');

    // Insert students
    const students = await Student.insertMany([
      {
        name: 'John Doe',
        uid: 'S001',
        sport: basketball._id,
        location: 'Court A',
        status: 'not visited',
        photo: 'https://example.com/photos/john.jpg',
        dob: new Date('2000-01-15'),
        inlineCategory: 'Junior',
        represents: 'School A'
      },
      {
        name: 'Jane Smith',
        uid: 'S002',
        sport: soccer._id,
        location: 'Field B',
        status: 'entrance checkin',
        photo: 'https://example.com/photos/jane.jpg',
        dob: new Date('1999-05-20'),
        inlineCategory: 'Senior',
        represents: 'School B'
      }
    ]);
  

    // Verify data
    const sportCount = await Sport.countDocuments();
    const studentCount = await Student.countDocuments();
    await mongoose.disconnect();

  } catch (error) {
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;