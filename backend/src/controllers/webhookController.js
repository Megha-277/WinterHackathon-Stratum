const axios = require('axios');


// 🧠 Compact Crowd Engine
const getCrowdReport = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    // Multipliers: Lunch/Dinner peaks, Weekend surge, Late night drop
    let mult = 1.0;
    if ((hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 21)) mult = 1.7;
    if (day === 0 || day === 6) mult += 0.2;
    if (hour < 7 || hour > 22) mult = 0.3;

    const percentage = Math.min(Math.round((Math.floor(Math.random() * 25) + 30) * mult), 99);
    const filled = Math.round(percentage / 10);
    const meter = "█".repeat(filled) + "░".repeat(10 - filled);
    
    return { percentage, meter };
};

// 🤖 Main Bot Logic
exports.handleSaarthiChat = async (req, res) => {
    const parameters = req.body.queryResult.parameters || {};
    const requestedPlace = parameters.place_name;
    const API_KEY = process.env.GEOAPIFY_KEY;
    //= '62ee01cb2bac4364a04b1a167549f59f'

    if (!requestedPlace) return res.json({ fulfillmentText: "Which place in Mangalore?" });

    // Center coordinates for Mangalore bias
    const [m_lat, m_lon] = [12.9141, 74.8560];

    try {
        // 1. Find the Location
        const searchUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(requestedPlace)}&filter=circle:${m_lon},${m_lat},50000&bias=proximity:${m_lon},${m_lat}&apiKey=${API_KEY}`;
        const searchRes = await axios.get(searchUrl);

        if (!searchRes.data.features?.length) {
            return res.json({ fulfillmentText: `I couldn't find "${requestedPlace}" in Mangalore.` });
        }

        const properties = searchRes.data.features[0].properties;
        const [lon, lat] = searchRes.data.features[0].geometry.coordinates;
        const crowd = getCrowdReport();

        let response = `📍 **${properties.name || properties.address_line1}**\n` +
                       `📊 **Crowd:** [${crowd.meter}] ${crowd.percentage}%\n` +
                       `⏳ **Wait:** ~${Math.round(crowd.percentage / 2.5)} mins\n`;

        // 2. Plan B Logic (Triggered if crowd >= 70)
        if (crowd.percentage >= 70) {
            const categories = "leisure,tourism,shopping.malls,catering.restaurant";
            const nearbyUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},2000&limit=5&apiKey=${API_KEY}`;
            const nearbyRes = await axios.get(nearbyUrl);

            const suggestions = nearbyRes.data.features
                .filter(f => f.properties.name && f.properties.name !== properties.name)
                .slice(0, 2)
                .map(f => `👉 ${f.properties.name}`)
                .join('\n');

            response += `\n⚠️ **Very Crowded!**\n💡 **Plan B:** Try these nearby:\n${suggestions || "Check back later!"}`;
        } else {
            response += `\n✅ **Status:** Comfortable to visit.`;
        }

        console.log(`✅ ${properties.name}: ${crowd.percentage}%`);
        return res.json({ fulfillmentText: response });

    } catch (err) {
        console.error("Webhook Error:", err.message);
        return res.json({ fulfillmentText: "My map sensors are offline. Try again?" });
    }
};