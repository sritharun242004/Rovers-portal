const Event = require('../models/Event');
const Sport = require('../models/Sport');
const EventSport = require('../models/EventSport');

class EventService {
  // Get all events with optional population of sports
  static async getAllEvents(populateSports = false) {
    try {
      let query = Event.find();
      query = query.sort({ createdAt: -1 });

      if (populateSports) {
        query = query.populate({
          path: 'sports',
          select: 'name description image location'
        });
      }

      return await query.lean();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  // Get a single event by ID with its sports
  static async getEventById(eventId) {
    try {
      const event = await Event.findById(eventId).lean();

      if (!event) {
        throw new Error('Event not found');
      }

      // Get all sports linked to this event
      const eventSports = await EventSport.find({ event: eventId })
        .populate({
          path: 'sport',
          select: 'name description image location'
        })
        .lean();

      // Extract just the sport objects
      const sports = eventSports.map(es => es.sport);

      return {
        ...event,
        sports
      };
    } catch (error) {
      console.error(`Error fetching event ${eventId}:`, error);
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  }

  // Get all sports for a specific event
  static async getSportsForEvent(eventId) {
    try {
      const eventSports = await EventSport.find({ event: eventId })
        .populate({
          path: 'sport',
          select: 'name description image location startDate endDate duration'
        })
        .lean();
      return eventSports.map(es => es.sport);
    } catch (error) {
      console.error(`Error fetching sports for event ${eventId}:`, error);
      throw new Error(`Failed to fetch sports for event: ${error.message}`);
    }
  }

  // Get all sports (not linked to any specific event)
  static async getAllSports() {
    try {
      return await Sport.find()
        .select('name description image location')
        .lean();
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw new Error(`Failed to fetch sports: ${error.message}`);
    }
  }
}

module.exports = EventService;