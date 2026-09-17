import CommunityEvent from '../models/CommunityEvent.js';
import { initialCommunityEvents } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let eventsCache = [...initialCommunityEvents];

export const getEvents = async (req, res) => {
  try {
    if (getDBStatus()) {
      const events = await CommunityEvent.find();
      return res.json({ success: true, count: events.length, events });
    }
    res.json({ success: true, count: eventsCache.length, events: eventsCache });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const registerEventAttendee = async (req, res) => {
  try {
    const { id } = req.params;
    const event = eventsCache.find((e) => e.id === id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    event.attendeesCount += 1;
    res.json({ success: true, attendeesCount: event.attendeesCount, message: 'Successfully registered for this community event!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
