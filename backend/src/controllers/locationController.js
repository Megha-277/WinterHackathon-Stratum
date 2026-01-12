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
// Example: /api/locations/vibe/quiet
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

// 4. PATCH update (Admin Override / Guardian Layer)
exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; 
        
        // Updates can include: crowd_level, is_flagged, wait_time, etc.
        await db.collection('locations').doc(id).update(updates);
        
        res.status(200).json({ 
            message: "Location updated successfully",
            updatedId: id 
        });
    } catch (error) {
        res.status(500).json({ error: "Admin override failed" });
    }
};