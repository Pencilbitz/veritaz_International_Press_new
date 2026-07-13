import * as eventModel from '../models/eventModel.js';
import db from '../config/db.js';

// Helper to check if event date/time is in the past
const isEventPast = (dateStr, timeStr) => {
  if (!dateStr) return false;
  try {
    let dateToParse = dateStr;
    // Check if it's a date range like "20 - 24 Apr 2026"
    if (dateStr.includes('-') && !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = dateStr.split('-');
      dateToParse = parts[parts.length - 1].trim();
    }
    
    let eventDate = new Date(dateToParse);
    if (isNaN(eventDate.getTime())) return false;

    // Try parsing the time
    let timeParsed = false;
    if (timeStr && typeof timeStr === 'string' && timeStr.trim() !== '') {
      let endTimeStr = timeStr;
      // If time is a range like "12:00PM - 12:32PM", pick the end time
      if (timeStr.includes('-')) {
        const parts = timeStr.split('-');
        endTimeStr = parts[parts.length - 1];
      }
      
      const t = endTimeStr.trim().toUpperCase();
      const timeMatch = t.match(/(\d{1,2}):?(\d{2})?/);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        let mins = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        
        if (t.includes('PM') && hours < 12) hours += 12;
        if (t.includes('AM') && hours === 12) hours = 0;
        
        eventDate.setHours(hours, mins, 0, 0);
        timeParsed = true;
      }
    }

    // If a specific time was not provided or failed to parse, use end of day
    if (!timeParsed) {
      eventDate.setHours(23, 59, 59, 999);
    }
    
    return new Date() > eventDate;
  } catch (e) {
    return false;
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await eventModel.getAllEvents();
    
    // Auto-update past events to 'Completed'
    for (let evt of events) {
      if (evt.status !== 'Completed' && isEventPast(evt.date, evt.time)) {
        evt.status = 'Completed';
        await db.query('UPDATE events SET status = ? WHERE id = ?', ['Completed', evt.id]);
      }
    }
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error fetching events' });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await eventModel.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Server error fetching event' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const newId = await eventModel.createEvent(req.body);
    res.status(201).json({ message: 'Event created successfully', id: newId });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error creating event' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const affectedRows = await eventModel.updateEvent(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Server error updating event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const affectedRows = await eventModel.deleteEvent(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Server error deleting event' });
  }
};

export const deleteMultipleEvents = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No IDs provided' });
    }
    const affectedRows = await eventModel.deleteMultipleEvents(ids);
    res.status(200).json({ message: `${affectedRows} events deleted successfully` });
  } catch (error) {
    console.error('Error deleting multiple events:', error);
    res.status(500).json({ error: 'Server error deleting multiple events' });
  }
};
