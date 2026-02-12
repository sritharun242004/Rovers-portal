require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Sport = require('../models/Sport');
const EventSport = require('../models/EventSport');

const seedEventSportData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to database successfully');

    // 1. Create dummy sports data if they don't exist
    console.log('Creating/checking sports data...');
    const sportNames = [
      'Athletics', 'Swimming', 'Taekwondo', 'Karate',
      'Skating', 'Tennis', 'Badminton'
    ];

    const sportPromises = sportNames.map(async (name) => {
      const existingSport = await Sport.findOne({ name });
      if (!existingSport) {
        console.log(`Creating sport: ${name}`);
        return Sport.create({
          name,
          description: `${name} is a competitive sport focused on physical fitness and skill.`,
          image: `https://example.com/images/${name.toLowerCase()}.jpg`,
          location: 'Dubai Sports City',
          address: 'Dubai Sports City, Dubai, UAE',
          mapsPin: 'https://goo.gl/maps/example'
        });
      }
      console.log(`Sport ${name} already exists`);
      return existingSport;
    });

    const sports = await Promise.all(sportPromises);
    console.log(`Total ${sports.length} sports available`);

    // 2. Create a dummy event if it doesn't exist
    console.log('Creating/checking event data...');
    let event = await Event.findOne({ name: 'Dubai Youth Sports Festival 2024' });

    if (!event) {
      console.log('Creating new event');
      event = await Event.create({
        name: 'Dubai Youth Sports Festival 2024',
        poster: 'https://example.com/images/dubai-youth-festival-2024.jpg',
        description: 'Join us for the most exciting youth sports festival in Dubai, featuring competitions in various sports, workshops, and more.',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-15')
      });
      console.log('Event created successfully');
    } else {
      console.log('Event already exists');
    }

    // 3. Link the event with sports
    console.log('Linking event with sports...');
    for (const sport of sports) {
      const existingLink = await EventSport.findOne({
        event: event._id,
        sport: sport._id
      });

      if (!existingLink) {
        await EventSport.create({
          event: event._id,
          sport: sport._id
        });
        console.log(`Linked sport ${sport.name} with event ${event.name}`);
      } else {
        console.log(`Sport ${sport.name} is already linked with event ${event.name}`);
      }
    }

    console.log('Seeding completed successfully');

  } catch (error) {
    console.error('Error seeding event and sport data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the seeding function
seedEventSportData();