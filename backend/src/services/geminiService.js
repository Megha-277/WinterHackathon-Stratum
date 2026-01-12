const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API with your key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateSaarthiResponse = async (placeName, context) => {
    try {
        // Use gemini-1.5-flash for the fastest response during a demo
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are "Saarthi", a helpful AI travel guide for Mangalore. 
            A user is asking about: ${placeName}.
            Here is the live data: ${JSON.stringify(context)}.
            
            Rules:
            1. If it's a Temple and crowded, suggest staying but warn about wait times.
            2. If it's a Beach/Mall and crowded, suggest the "Plan B" locations provided in the context.
            3. Use a helpful, Mangalorean-friendly tone.
            4. Keep the response under 3 sentences.
            5. Use the "meter" (█░) provided in the context to show the crowd level.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        // Fallback if the AI fails
        return `I'm having trouble connecting to my AI brain, but ${placeName} is at ${context[0].crowd_level}% capacity right now!`;
    }
};