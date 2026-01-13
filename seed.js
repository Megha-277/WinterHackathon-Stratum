// Check this path! If seed.js is in your ROOT, and firebase is in src/services:
const { db } = require('./backend/src/services/firebase'); 

const locations = [
    {
        name: "Panambur Beach",
        vibes: ["scenic", "active", "coastal"],
        category: "beach",
        description: "A popular beach known for its kite festivals and sunset views."
    },
    {
        name: "Tannirbhavi Beach",
        vibes: ["quiet", "scenic", "coastal"],
        category: "beach",
        description: "A more secluded beach perfect for a peaceful walk."
    },
    {
        name: "Someshwara Beach",
        vibes: ["scenic", "spiritual", "coastal"],
        category: "beach",
        description: "Famous for the large rocks called 'Rudra Shile' and the old temple."
    },
    {
        name: "Kadri Manjunath Temple",
        vibes: ["peaceful", "historic", "spiritual"],
        category: "religion",
        description: "A historic temple dating back to the 10th century."
    },
    {
        name: "St. Aloysius Chapel",
        vibes: ["historic", "peaceful", "artistic"],
        category: "religion",
        description: "Known for its stunning frescos and Sistine Chapel-like interior."
    },
    {
        name: "Mangaladevi Temple",
        vibes: ["historic", "spiritual", "vibrant"],
        category: "religion",
        description: "The temple that gave Mangalore its name."
    },
    {
        name: "Pilikula Nisargadhama",
        vibes: ["nature", "family", "educational"],
        category: "tourism",
        description: "An eco-tourism park with a zoo, botanical garden, and lake."
    },
    {
        name: "Sultan Battery",
        vibes: ["historic", "scenic", "quiet"],
        category: "tourism",
        description: "Watchtower built by Tipu Sultan with views of the Arabian Sea."
    },
    {
        name: "Pabbas",
        vibes: ["vibrant", "foodie", "busy"],
        category: "cafe",
        description: "The most iconic ice cream parlour in Mangalore."
    },
    {
        name: "Ideal Cafe",
        vibes: ["classic", "foodie", "busy"],
        category: "cafe",
        description: "Famous for its Gadi Bud ice cream and authentic snacks."
    },
    {
        name: "Forum Fiza Mall",
        vibes: ["vibrant", "shopping", "indoor"],
        category: "shopping",
        description: "A large modern mall with international brands and food court."
    },
    {
        name: "City Centre Mall",
        vibes: ["vibrant", "busy", "shopping"],
        category: "shopping",
        description: "Located in the heart of the city, popular for daily shopping."
    },
    {
        name: "Kadri Park",
        vibes: ["quiet", "nature", "active"],
        category: "nature",
        description: "The largest park in Mangalore city limits, great for jogging."
    },
    {
        name: "St. Joseph Engineering College",
        vibes: ["educational", "active", "modern"],
        category: "education",
        description: "A premier engineering institution (Our Hackathon Venue!)."
    },
    {
        name: "Guhantara Resort",
        vibes: ["adventure", "unique", "nature"],
        category: "tourism",
        description: "An underground cave resort with various activities."
    }
];

async function seedData() {
    console.log("🌱 Starting Seed Process...");
    const collectionRef = db.collection('locations');

    try {
        for (const loc of locations) {
            // Check if place exists to avoid duplicates
            const snapshot = await collectionRef.where('name', '==', loc.name).get();
            
            if (snapshot.empty) {
                await collectionRef.add(loc);
                console.log(`✅ Added: ${loc.name}`);
            } else {
                console.log(`⏩ Skipping: ${loc.name} (Already exists)`);
            }
        }
        console.log("✨ Seeding Complete! Your database is now rich with data.");
    } catch (error) {
        console.error("❌ Seeding Failed:", error);
    } finally {
        process.exit();
    }
}

seedData();