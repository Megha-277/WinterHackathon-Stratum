const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize the API with your Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateSaarthiResponse = async (userQuery, locationData) => {
    // Using the 2026 standard: Gemini 3 Flash
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview" 
    });

    // 1. Prepare the 'Current Reality' for the AI
    const dataContext = locationData.map(loc => (
        `- ${loc.name} | Category: ${loc.category} | Crowd: ${loc.crowd_level}% | Vibes: ${loc.vibes.join(", ")}`
    )).join("\n");

    // 2. The Logic Prompt (Temple vs. Beach rules)
    const prompt = `
    You are "Saarthi", an AI city guide. Use this LIVE DATA to help the user:
    
    LIVE DATA:
    ${dataContext}

    USER QUERY: "${userQuery}"

    STRICT RULES:
    - If a "Temple" is crowded (>70%), DO NOT suggest leaving. Give a "Time Advisory" (e.g., 'Stay for Aarti, but expect queues').
    - If a "Beach" or "Mall" is crowded (>70%), suggest 2 quiet alternatives (<40% crowd) from the data.
    - If a place is "Flagged", warn the user immediately.
    - Keep it under 3 sentences and very helpful.
    `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Engine Error:", error);
        return "Saarthi is momentarily disconnected. Please check the physical signboards for crowd status.";
    }
};