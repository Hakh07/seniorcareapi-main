const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticate = require('../middleware/authenticate')

// Create an Event
router.post('/',authenticate, eventController.createEvent);

// Upload the Event Picture
router.post('/upload-event-image',authenticate, eventController.uploadEventImage);

// Get All Events (sorted by start date ascending)
router.get('/',authenticate, eventController.getAllEvents);

// Get Event by ID
router.get('/:id',authenticate, eventController.getEventById);

// Update Event
router.put('/:id',authenticate, eventController.updateEvent);

// Delete Event
router.delete('/:id',authenticate, eventController.deleteEvent);

module.exports = router;
