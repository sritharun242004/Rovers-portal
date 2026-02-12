require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Sport = require('../models/Sport');
const ParentStudent = require('../models/ParentStudent');

async function seedDummyData() {
  try {
   
    await mongoose.connect(process.env.MONGODB_URI);
    // Create sports if they don't exist
    const sports = ['Football', 'Basketball', 'Swimming'];
    const sportDocs = [];

    for (const sportName of sports) {
      const existingSport = await Sport.findOne({ name: sportName });
      if (existingSport) {
        sportDocs.push(existingSport);
      } else {
        const newSport = await Sport.create({ name: sportName });
        sportDocs.push(newSport);
      }
    }

    // Create dummy students
    const dummyStudents = [
      {
        name: 'John Smith',
        uid: 'ST10001',
        sport: sportDocs[0]._id,
        location: 'Field A',
        status: 'entrance checkin',
        photo: 'https://randomuser.me/api/portraits/men/1.jpg',
        dob: new Date('2010-05-12'),
        inlineCategory: 'Junior',
        represents: 'Team A'
      },
      {
        name: 'Emma Johnson',
        uid: 'ST10002',
        sport: sportDocs[1]._id,
        location: 'Court B',
        status: 'sports checkin',
        photo: 'https://randomuser.me/api/portraits/women/2.jpg',
        dob: new Date('2009-11-23'),
        inlineCategory: 'Intermediate',
        represents: 'Team B'
      },
      {
        name: 'Michael Brown',
        uid: 'ST10003',
        sport: sportDocs[2]._id,
        location: 'Pool C',
        status: 'not visited',
        photo: 'https://randomuser.me/api/portraits/men/3.jpg',
        dob: new Date('2011-02-18'),
        inlineCategory: 'Beginner',
        represents: 'Team C'
      }
    ];

    const createdStudents = [];

    for (const studentData of dummyStudents) {
      const existingStudent = await Student.findOne({ uid: studentData.uid });
      if (existingStudent) {
        // Update the existing student with new data
        Object.assign(existingStudent, studentData);
        await existingStudent.save();
        createdStudents.push(existingStudent);
      } else {
        const newStudent = await Student.create(studentData);
        createdStudents.push(newStudent);
      }
    }

    // Create parent users
    const dummyParents = [
      {
        name: 'Parent One',
        email: 'parent1@example.com',
        password: 'password123',
        role: 'parent'
      },
      {
        name: 'Parent Two',
        email: 'parent2@example.com',
        password: 'password123',
        role: 'parent'
      },
      {
        name: 'Parent Three',
        email: 'parent3@example.com',
        password: 'password123',
        role: 'parent'
      }
    ];

    for (let i = 0; i < dummyParents.length; i++) {
      const parentData = dummyParents[i];
      let parent = await User.findOne({ email: parentData.email });

      if (!parent) {
        parent = await User.create(parentData);
      }

      // Link parent to a student (one parent per student for simplicity)
      const studentToLink = createdStudents[i];

      const existingRelationship = await ParentStudent.findOne({
        parent: parent._id,
        student: studentToLink._id
      });

      if (!existingRelationship) {
        await ParentStudent.create({
          parent: parent._id,
          student: studentToLink._id,
          relationship: 'parent'
        });
      }
    }
  } catch (error) {
    console.error('Error seeding dummy data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedDummyData();
}

module.exports = seedDummyData;