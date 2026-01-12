const axios = require('axios');

// 🧠 The Crowd Engine (No changes here)
const getCrowdReport = (forceHigh = false) => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    let mult = 1.0;
    if ((hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 21)) mult = 1.7;
    if (day === 0 || day === 6) mult += 0.2;
    if (hour < 7 || hour > 22) mult = 0.3;

    let percentage = forceHigh 
        ? Math.floor(Math.random() * 10) + 89 
        : Math.min(Math.round((Math.floor(Math.random() * 25) + 30) * mult), 99);

    const filled = Math.round(percentage / 10);
    const meter = "█".repeat(filled) + "░".repeat(10 - filled);
    
    return { percentage, meter };
};

// 🤖 Main Bot Logic
exports.handleSaarthiChat = async (req, res) => {
    const parameters = req.body.queryResult.parameters || {};
    const queryText = req.body.queryResult.queryText.toLowerCase();
    const requestedPlace = parameters.place_name;
    const API_KEY = process.env.GEOAPIFY_KEY;

    if (!requestedPlace) {
        return res.json({ fulfillmentText: "I'm ready! Which place in Mangalore should I check?" });
    }

    const [m_lat, m_lon] = [12.9141, 74.8560];

    try {
        // 1. Find Location
        const searchUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(requestedPlace)}&filter=circle:${m_lon},${m_lat},50000&bias=proximity:${m_lon},${m_lat}&apiKey=${API_KEY}`;
        const searchRes = await axios.get(searchUrl);

        if (!searchRes.data.features?.length) {
            return res.json({ fulfillmentText: `I couldn't find "${requestedPlace}" in Mangalore.` });
        }

        const props = searchRes.data.features[0].properties;
        const [lon, lat] = searchRes.data.features[0].geometry.coordinates;
        const placeName = props.name || props.address_line1;

        // 2. Get Crowd Data
        const isSuper = queryText.includes('super');
        const crowd = getCrowdReport(isSuper);

        // 3. Build the Response Manually
        let responseText = `📍 **${placeName}**\n`;
        responseText += `📊 Crowd: [${crowd.meter}] ${crowd.percentage}%\n`;
        responseText += `⏳ Est. Wait: ~${Math.round(crowd.percentage / 2.5)} mins\n\n`;

        // 4. Plan B Logic (Only if crowded)
        if (crowd.percentage >= 70) {
            responseText += `⚠️ **High Crowd Alert!**\nIt's quite busy here right now. `;
            
            const categories = "leisure,tourism,shopping.malls,religion";
            const nearbyUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},2000&limit=5&apiKey=${API_KEY}`;
            const nearbyRes = await axios.get(nearbyUrl);
            
            const suggestions = nearbyRes.data.features
                .filter(f => f.properties.name && f.properties.name !== placeName)
                .slice(0, 2)
                .map(f => `👉 ${f.properties.name}`)
                .join('\n');

            if (suggestions) {
                responseText += `Maybe try these nearby alternatives:\n${suggestions}`;
            } else {
                responseText += `I suggest visiting a bit later for a better experience!`;
            }
        } else {
            responseText += `✅ It's a great time to visit! Enjoy your trip.`;
        }

        console.log(`✅ Served Request for ${placeName}`);
        return res.json({ fulfillmentText: responseText });

    } catch (err) {
        console.error("Webhook Error:", err.message);
        return res.json({ fulfillmentText: "Sorry, I'm having trouble connecting to my map data. Try again?" });
    }
};
