const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const webhookController = require('../controllers/webhookController'); // Import here

// Regular API routes
router.get('/', locationController.getLocations);
router.get('/:id', locationController.getLocationById);

// DIALOGFLOW WEBHOOK ROUTE
router.post('/webhook', webhookController.handleSaarthiChat);

module.exports = router;