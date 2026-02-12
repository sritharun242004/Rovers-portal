const mongoose = require('mongoose');
require('dotenv').config();
const AgeCategory = require('../models/AgeCategory');
const Distance = require('../models/Distance');
const SportSubType = require('../models/SportSubType');
const Sport = require('../models/Sport');

const seedCategoryData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to database successfully');

    // 1. Add values to AgeCategory table
    console.log('Adding age categories...');
    const ageCategories = [
      'Under 7',
      'Under 9',
      'Under 11',
      'Under 12',
      'Under 13',
      'Under 15',
      'Under 17'
    ];

    for (const category of ageCategories) {
      const existingCategory = await AgeCategory.findOne({ ageGroup: category });
      if (!existingCategory) {
        await AgeCategory.create({ ageGroup: category });
        console.log(`Added age category: ${category}`);
      } else {
        console.log(`Age category ${category} already exists`);
      }
    }

    // 2. Add values to Distance table
    console.log('Adding distances...');
    const distances = [
      { category: '25m', value: 25 },
      { category: '50m', value: 50 },
      { category: '60m', value: 60 },
      { category: '80m', value: 80 },
      { category: '100m', value: 100 },
      { category: '200m', value: 200 },
      { category: '400m', value: 400 }
    ];

    for (const distance of distances) {
      const existingDistance = await Distance.findOne({ category: distance.category });
      if (!existingDistance) {
        await Distance.create(distance);
        console.log(`Added distance: ${distance.category}`);
      } else {
        console.log(`Distance ${distance.category} already exists`);
      }
    }

    // 3. Add values to SportSubType table
    console.log('Adding sport sub types...');
    const sportSubTypes = ['POOMSAE', 'KATA', 'QUAD', 'INLINE'];

    // Get all sports to associate with sub-types
    const sports = await Sport.find();

    if (sports.length === 0) {
      console.log('No sports found in database. Creating a default sport.');
      const defaultSport = await Sport.create({ name: 'Default Sport' });
      sports.push(defaultSport);
    }

    for (const sport of sports) {
      for (const type of sportSubTypes) {
        const existingSubType = await SportSubType.findOne({
          type: type,
          sport: sport._id
        });

        if (!existingSubType) {
          await SportSubType.create({
            type: type,
            sport: sport._id
          });
          console.log(`Added sport sub type: ${type} for sport: ${sport.name}`);
        } else {
          console.log(`Sport sub type ${type} for sport ${sport.name} already exists`);
        }
      }
    }

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the seeding function
seedCategoryData();