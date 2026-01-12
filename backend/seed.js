const { db } = require('./src/services/firebase');

const locations = [
  {
    name: "Main Temple - North Gate",
    category: "temple",
    lat: 12.9716,
    lng: 77.5946,
    crowd_level: 85,
    wait_time: 120,
    vibes: ["spiritual", "crowded"],
    is_flagged: false,
    admin_msg: ""
  },
  {
    name: "Main Temple - South Entrance",
    category: "temple",
    lat: 12.9695,
    lng: 77.5940,
    crowd_level: 40,
    wait_time: 15,
    vibes: ["quiet", "spiritual"],
    is_flagged: false,
    admin_msg: ""
  },
  {
    name: "Pilgrim Rest Garden",
    category: "park",
    lat: 12.9750,
    lng: 77.5990,
    crowd_level: 20,
    wait_time: 0,
    vibes: ["calm", "nature"],
    is_flagged: false,
    admin_msg: ""
  },
  {
    name: "Annapurna Food Court",
    category: "restaurant",
    lat: 12.9725,
    lng: 77.5960,
    crowd_level: 75,
    wait_time: 45,
    vibes: ["social", "busy"],
    is_flagged: false,
    admin_msg: ""
  },
  {
    name: "Heritage Souvenir Market",
    category: "retail",
    lat: 12.9680,
    lng: 77.5920,
    crowd_level: 60,
    wait_time: 30,
    vibes: ["busy", "retail"],
    is_flagged: false,
    admin_msg: ""
  },
  {
    name: "Sacred Banyan Tree Path",
    category: "temple",
    lat: 12.9735,
    lng: 77.5915,
    crowd_level: 30,
    wait_time: 5,
    vibes: ["historic", "quiet"],
    is_flagged: false,
    admin_msg: ""
  },
  {
    name: "West Parking & Transit",
    category: "gate",
    lat: 12.9710,
    lng: 77.5890,
    crowd_level: 90,
    wait_time: 60,
    vibes: ["busy", "transit"],
    is_flagged: true,
    admin_msg: "Heavy vehicle movement - use East Gate"
  },
  {
    name: "Ancient Chariot Museum",
    category: "park",
    lat: 12.9760,
    lng: 77.5930,
    crowd_level: 10,
    wait_time: 0,
    vibes: ["educational", "quiet"],
    is_flagged: false,
    admin_msg: ""
  }
];

const seedDB = async () => {
  try {
    const collectionRef = db.collection('locations');

    // 1. CLEAR EXISTING DATA (To avoid duplicate markers on your map)
    console.log("🗑️ Clearing old data...");
    const snapshot = await collectionRef.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    // 2. ADD NEW LOCATIONS
    console.log("🌱 Planting new data...");
    for (const loc of locations) {
      await collectionRef.add(loc);
    }

    console.log(`
    ✅ SUCCESS!
    📍 Seeding complete: 8 locations added.
    🚀 Restart your server and check: http://localhost:5000/api/locations
    `);
    
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();