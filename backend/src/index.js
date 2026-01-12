require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const locationRoutes = require('./routes/locationRoutes');
const { db } = require('./services/firebase'); // Import db to check connection on start

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---
app.use(cors()); // ✅ Now your teammate's HTML/JS can talk to this server
app.use(express.json()); 

// --- 2. Routes ---
app.use('/api/locations', locationRoutes);

// --- 3. Health Check ---
app.get('/', (req, res) => {
    res.send('🚀 Saarthi Backend is Online and CORS is enabled');
});

// --- 4. Start Server & Verify Firebase ---
app.listen(PORT, async () => {
    console.log(`================================================`);
    console.log(`✅ SAARTHI BACKEND ACTIVE`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🔗 Webhook: /api/locations/webhook`);
    
    // Quick Firebase Auth Check
    try {
        await db.collection('locations').limit(1).get();
        console.log(`🔥 Firebase Firestore: Connected`);
    } catch (err) {
        console.error(`❌ Firebase Firestore: Connection Failed (${err.message})`);
    }
    console.log(`================================================`);
});