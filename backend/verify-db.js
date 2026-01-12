const { db } = require('./src/services/firebase');

async function checkCloudData() {
    try {
        console.log("📡 Checking for teammate's data...");
        const snapshot = await db.collection('locations').get();
        
        if (snapshot.empty) {
            console.log("⚠️ Connection works, but the database is empty! Did your friend seed it yet?");
            return;
        }

        console.log(`✅ Success! Found ${snapshot.size} locations in the cloud:`);
        snapshot.forEach(doc => {
            const d = doc.data();
            console.log(`📍 Name: ${d.name} | Category: ${d.category} | Crowd: ${d.crowd_level}%`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ DB Check Failed:", error.message);
        process.exit(1);
    }
}

checkCloudData();