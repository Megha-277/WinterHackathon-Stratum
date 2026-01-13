const axios = require('axios');
const { db } = require('../services/firebase');

// 🧠 The Crowd Engine
const getCrowdReport = (forceHigh = false) => {
    let percentage = forceHigh 
        ? Math.floor(Math.random() * 10) + 89 
        : Math.floor(Math.random() * 40) + 20; 
    const filled = Math.round(percentage / 10);
    return { percentage, meter: "█".repeat(filled) + "░".repeat(10 - filled) };
};

exports.handleSaarthiChat = async (req, res) => {
    const parameters = req.body.queryResult.parameters || {};
    const queryText = req.body.queryResult.queryText.toLowerCase();
    const requestedPlace = parameters.place_name;
    const API_KEY = process.env.GEOAPIFY_KEY;

    if (!requestedPlace) {
        return res.json({ fulfillmentText: "I'm ready! Which place in Mangalore should I check?" });
    }

    try {
        // 1. Find Location via Geoapify
        const m_lat = 12.9141;
        const m_lon = 74.8560;
        
        // Use filter and bias to keep results inside Mangalore
        const searchUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(requestedPlace)}&filter=circle:${m_lon},${m_lat},50000&bias=proximity:${m_lon},${m_lat}&apiKey=${API_KEY}`;
        
        const searchRes = await axios.get(searchUrl);

        if (!searchRes.data.features?.length) {
            return res.json({ fulfillmentText: `I couldn't find "${requestedPlace}" in Mangalore.` });
        }

        const props = searchRes.data.features[0].properties;
        const [lon, lat] = searchRes.data.features[0].geometry.coordinates;
        const placeName = props.name || props.address_line1;

        console.log(`🔍 Searching Database for: ${placeName}`);

        // 2. Crowd Report Logic
        const isSuper = queryText.includes('super') || queryText.includes('very');
        const crowd = getCrowdReport(isSuper);

        let responseText = `📍 **${placeName}**\n`;
        responseText += `📊 Crowd: [${crowd.meter}] ${crowd.percentage}%\n`;
        responseText += `⏳ Est. Wait: ~${Math.round(crowd.percentage / 2.5)} mins\n\n`;

        // 3. SMART PLAN B (Only if crowded)
        if (crowd.percentage >= 70) {
            responseText += `⚠️ **High Crowd Alert!**\n`;

            // Try to find the vibe in our DB
            // We search for the name exactly OR we can search for documents where the name is "contained"
            const internalDoc = await db.collection('locations')
                .where('name', '>=', placeName)
                .where('name', '<=', placeName + '\uf8ff')
                .limit(1).get();

            let suggestions = [];

            if (!internalDoc.empty) {
                const placeData = internalDoc.docs[0].data();
                const primaryVibe = placeData.vibes?.[0];

                if (primaryVibe) {
                    responseText += `Since you're looking for a **${primaryVibe}** vibe, try these instead:\n`;
                    const vibeMatches = await db.collection('locations')
                        .where('vibes', 'array-contains', primaryVibe.toLowerCase())
                        .limit(3).get();
                    
                    suggestions = vibeMatches.docs
                        .filter(doc => doc.data().name.toLowerCase() !== placeName.toLowerCase())
                        .map(doc => `👉 ${doc.data().name}`);
                }
            }

            // Fallback to Geoapify Nearby
            if (suggestions.length === 0) {
                const nearbyUrl = `https://api.geoapify.com/v2/places?categories=leisure,tourism&filter=circle:${lon},${lat},2000&limit=3&apiKey=${API_KEY}`;
                const nearbyRes = await axios.get(nearbyUrl);
                suggestions = nearbyRes.data.features
                    .filter(f => f.properties.name && f.properties.name !== placeName)
                    .map(f => `👉 ${f.properties.name}`);
            }

            responseText += suggestions.length > 0 
                ? suggestions.join('\n') 
                : "It's quite busy. Maybe visit a bit later!";
        } else {
            responseText += `✅ It's a great time to visit! No major crowds detected.`;
        }

        return res.json({ fulfillmentText: responseText });

    } catch (err) {
        console.error("❌ Webhook Error:", err.message);
        return res.json({ fulfillmentText: "I'm having trouble connecting to my data. Try again in a moment?" });
    }
};