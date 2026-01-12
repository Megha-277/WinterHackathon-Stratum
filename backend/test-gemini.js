require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function verifyAI() {
    console.log("🚀 Testing Gemini 3 Flash Connection...");
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Updated to the 2026 preview model
    // Change from gemini-3-flash-preview TO:
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        const result = await model.generateContent("You are Saarthi AI. Confirm you are online in 2026.");
        console.log("\n--- 🤖 RESPONSE ---");
        console.log(result.response.text());
        console.log("-------------------\n✅ Connection Successful!");
    } catch (error) {
        console.error("\n❌ Connection Failed!");
        console.error("Reason:", error.message);
        console.log("\nTip: Double-check your GEMINI_API_KEY in .env");
    }
}

verifyAI();