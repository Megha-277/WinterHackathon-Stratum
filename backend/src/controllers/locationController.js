const { db } = require('../services/firebase');

// 1. GET all locations (For Map and general list)
exports.getLocations = async (req, res) => {
    try {
        const snapshot = await db.collection('locations').get();
        const locations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(locations);
    } catch (error) {
        console.error("Fetch All Error:", error);
        res.status(500).json({ error: "Failed to fetch locations" });
    }
};

// 2. GET a single location by ID
exports.getLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('locations').doc(id).get();
        
        if (!doc.exists) {
            return res.status(404).json({ error: "Location not found" });
        }
        
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch location details" });
    }
};

// 3. GET locations by Vibe (Explorer Mode)
exports.getLocationsByVibe = async (req, res) => {
    try {
        const { vibe } = req.params;
        const snapshot = await db.collection('locations')
            .where('vibes', 'array-contains', vibe.toLowerCase())
            .get();
            
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        res.status(200).json(results);
    } catch (error) {
        console.error("Vibe Filter Error:", error);
        res.status(500).json({ error: "Failed to filter by vibe" });
    }
};

// 4. GET unique vibes (Metadata Discovery)
exports.getUniqueVibes = async (req, res) => {
    try {
        const snapshot = await db.collection('locations').get();
        const vibeSet = new Set();

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.vibes && Array.isArray(data.vibes)) {
                data.vibes.forEach(vibe => vibeSet.add(vibe.toLowerCase()));
            }
        });

        res.status(200).json(Array.from(vibeSet));
    } catch (error) {
        console.error("Vibe Discovery Error:", error);
        res.status(500).json({ error: "Failed to discover vibes" });
    }
};

// 5. PATCH update (Guardian Layer / Admin Override)
exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; 

        // 🛡️ Guardian Check 1: Prevent empty updates
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No data provided for update." });
        }

        // 🛡️ Guardian Check 2: Protect the document ID
        delete updates.id;

        // Add a timestamp so we know when the crowd data was last changed
        updates.last_updated = new Date().toISOString();
        
        await db.collection('locations').doc(id).update(updates);
        
        res.status(200).json({ 
            message: "Location updated successfully",
            updatedId: id,
            timestamp: updates.last_updated
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: "Admin override failed" });
    }
};