const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const webhookController = require('../controllers/webhookController');

// --- 1. META ROUTES (Specific paths first) ---
// This must be above /:id so 'meta' isn't treated as an ID
router.get('/meta/vibes', locationController.getUniqueVibes);

// --- 2. FILTER ROUTES ---
router.get('/vibe/:vibe', locationController.getLocationsByVibe);

// --- 3. CORE API ROUTES ---
router.get('/', locationController.getLocations);
router.get('/:id', locationController.getLocationById);

// --- 4. ADMIN / GUARDIAN ROUTES ---
router.patch('/:id', locationController.updateLocation);

// --- 5. DIALOGFLOW WEBHOOK ---
router.post('/webhook', webhookController.handleSaarthiChat);

module.exports = router;