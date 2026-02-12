const mongoose = require('mongoose');
const Event = require('../models/Event');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jilani', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const sampleEvents = [
    {
        name: "Summer Sports Championship - USA",
        description: "Annual summer sports championship featuring various athletic competitions",
        startDate: new Date('2024-07-15'),
        endDate: new Date('2024-07-20'),
        country: "US",
        poster: "",
        sports: [], // Will be populated with existing sports
        hide: false
    },
    {
        name: "International Athletics Meet - UK",
        description: "International athletics meet with participants from around the world",
        startDate: new Date('2024-08-10'),
        endDate: new Date('2024-08-15'),
        country: "GB",
        poster: "",
        sports: [], // Will be populated with existing sports
        hide: false
    },
    {
        name: "Youth Sports Festival - India",
        description: "Youth sports festival promoting fitness and healthy competition",
        startDate: new Date('2024-09-05'),
        endDate: new Date('2024-09-10'),
        country: "IN",
        poster: "",
        sports: [], // Will be populated with existing sports
        hide: false
    }
];

async function addSampleEvents() {
    try {
        console.log('Connected to MongoDB');

        // Clear existing events (optional - remove this line if you want to keep existing events)
        await Event.deleteMany({});
        console.log('Cleared existing events');

        // Add sample events
        const createdEvents = await Event.insertMany(sampleEvents);
        console.log(`Added ${createdEvents.length} sample events:`);
        createdEvents.forEach(event => {
            console.log(`- ${event.name} (${event.country})`);
        });

        console.log('Sample events added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error adding sample events:', error);
        process.exit(1);
    }
}

addSampleEvents(); 