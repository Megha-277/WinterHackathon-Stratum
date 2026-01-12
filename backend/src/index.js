require('dotenv').config(); // Load GEOAPIFY_KEY from .env
const express = require('express');
const cors = require('cors');
const locationRoutes = require('./routes/locationRoutes'); // Path is relative to src/

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors());
app.use(express.json()); // Allows the server to read Dialogflow's data

// 2. Routes
// All your endpoints will start with /api/locations
app.use('/api/locations', locationRoutes);

// 3. Health Check
app.get('/', (req, res) => {
    res.send('🚀 Saarthi Backend is Online (Logic Mode: Manual)');
});

// 4. Start Server
app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`✅ SAARTHI BACKEND ACTIVE`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🔗 Webhook: /api/locations/webhook`);
    console.log(`================================================`);
});
