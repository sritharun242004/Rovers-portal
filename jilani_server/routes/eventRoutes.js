const express = require('express');
const { requireUser } = require('./middleware/auth');
const Event = require('../models/Event');
const { uploadToS3 } = require('../utils/s3');
const EventService = require('../services/eventService');

const router = express.Router();

// Get all events
router.get('/', requireUser, async (req, res,next) => {
  try {
    console.log('Fetching all events');
    const events = await Event.find({ hide: false  }).populate('sports').sort({ createdAt: -1 });
    console.log(`Found ${events.length} events`);
    return res.json({
      success: true,
      events
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get a single event
router.get('/:id', requireUser, async (req, res,next) => {
  try {
    console.log(`Fetching event with ID: ${req.params.id}`);
    const event = await Event.findById(req.params.id).populate('sports');
    if (!event) {
      console.log(`Event with ID ${req.params.id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    console.log(`Found event: ${event.name}`);
    return res.json({
      success: true,
      event
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create an event (admin only)
router.post('/', requireUser, uploadToS3.single('poster'), async (req, res,next) => {
  try {
    console.log('Creating new event, checking permissions');
    if (req.user.role !== 'manager') {
      console.log(`Unauthorized attempt to create event by user with role: ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: 'Only managers can create events'
      });
    }

    const eventData = req.body;
    console.log('Event data received:', eventData);

    if (req.file) {
      eventData.poster = req.file.location;
      console.log(`Poster uploaded to: ${eventData.poster}`);
    }

    // Validate required fields
    if (!eventData.name) {
      return res.status(400).json({
        success: false,
        message: 'Event name is required'
      });
    }

    if (!eventData.startDate || !eventData.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    if (!eventData.country) {
      return res.status(400).json({
        success: false,
        message: 'Country is required'
      });
    }

    const event = new Event(eventData);
    await event.save();
    console.log(`Event created successfully with ID: ${event._id}`);

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    next(error)
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update an event (admin only)
router.put('/:id', requireUser, uploadToS3.single('poster'), async (req, res,next) => {
  try {
    console.log(`Updating event with ID: ${req.params.id}`);
    if (req.user.role !== 'manager') {
      console.log(`Unauthorized attempt to update event by user with role: ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: 'Only managers can update events'
      });
    }

    const eventData = req.body;
    console.log('Update data received:', eventData);

    if (req.file) {
      eventData.poster = req.file.location;
      console.log(`New poster uploaded to: ${eventData.poster}`);
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      eventData,
      { new: true, runValidators: true }
    );

    if (!event) {
      console.log(`Event with ID ${req.params.id} not found for update`);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    console.log(`Event updated successfully: ${event.name}`);
    return res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
   next(error)
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete an event (admin only)
router.delete('/:id', requireUser, async (req, res,next) => {
  try {
    console.log(`Deleting event with ID: ${req.params.id}`);
    if (req.user.role !== 'manager') {
      console.log(`Unauthorized attempt to delete event by user with role: ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: 'Only managers can delete events'
      });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      console.log(`Event with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    console.log(`Event deleted successfully: ${event.name}`);
    return res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add a sport to an event (admin only)
router.post('/:id/sports', requireUser, async (req, res,next) => {
  try {
    console.log(`Adding sport to event with ID: ${req.params.id}`);
    if (req.user.role !== 'manager') {
      console.log(`Unauthorized attempt to update event by user with role: ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: 'Only managers can update events'
      });
    }

    const { sportId } = req.body;
    if (!sportId) {
      console.log('Sport ID is missing in request');
      return res.status(400).json({
        success: false,
        message: 'Sport ID is required'
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log(`Event with ID ${req.params.id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if sport exists
    const Sport = require('../models/Sport');
    const sport = await Sport.findById(sportId);
    if (!sport) {
      console.log(`Sport with ID ${sportId} not found`);
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    // Add sport if not already added
    if (!event.sports.includes(sportId)) {
      console.log(`Adding sport ${sport.name} to event ${event.name}`);
      event.sports.push(sportId);
      await event.save();
    } else {
      console.log(`Sport ${sport.name} is already added to event ${event.name}`);
    }

    return res.json({
      success: true,
      message: 'Sport added to event',
      event
    });
  } catch (error) {
    next(error)
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Remove a sport from an event (admin only)
router.delete('/:id/sports/:sportId', requireUser, async (req, res,next) => {
  try {
    console.log(`Removing sport ${req.params.sportId} from event ${req.params.id}`);
    if (req.user.role !== 'manager') {
      console.log(`Unauthorized attempt to update event by user with role: ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: 'Only managers can update events'
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log(`Event with ID ${req.params.id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if sport exists in the event
    const sportIndex = event.sports.indexOf(req.params.sportId);
    if (sportIndex === -1) {
      console.log(`Sport with ID ${req.params.sportId} not found in event ${event.name}`);
      return res.status(404).json({
        success: false,
        message: 'Sport not found in this event'
      });
    }

    // Remove the sport
    event.sports.splice(sportIndex, 1);
    await event.save();
    console.log(`Sport removed from event ${event.name} successfully`);

    return res.json({
      success: true,
      message: 'Sport removed from event',
      event
    });
  } catch (error) {
    next(error)
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all sports for a specific event
router.get('/:id/sports', requireUser, async (req, res,next) => {
  try {
    const eventId = req.params.id;
    console.log(`Fetching sports for event ID: ${eventId}`);
    const sports = await EventService.getSportsForEvent(eventId);
    console.log(`Found ${sports.length} sports for event ${eventId}`);

    return res.json({
      success: true,
      sports
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all sports (not specific to any event)
router.get('/sports/all', requireUser, async (req, res,next) => {
  try {
    console.log('Fetching all sports');
    const sports = await EventService.getAllSports();
    console.log(`Found ${sports.length} sports`);

    return res.json({
      success: true,
      sports
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;