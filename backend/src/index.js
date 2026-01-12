const express = require('express');
const cors = require('cors');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // NECESSARY: This allows your server to read Dialogflow's data

// Routes
// Your webhook will live at: https://your-url.com/api/locations/webhook
app.use('/api/locations', locationRoutes);

// Simple Health Check
app.get('/', (req, res) => {
  res.send('🚀 Saarthi Backend is Online!');
});

app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`✅ Saarthi Server running on Port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📡 Webhook Path: /api/locations/webhook`);
  console.log(`================================================`);
});