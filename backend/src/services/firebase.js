const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../../../serviceAccountKey.json');

try {
    const serviceAccount = require(serviceAccountPath);

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            // EXPLICITLY ADD THIS LINE:
            projectId: serviceAccount.project_id 
        });
        console.log(`✅ Connected to Firebase Project: ${serviceAccount.project_id}`);
    }
} catch (error) {
    console.error("❌ Firebase Init Error:", error.message);
}

const db = admin.firestore();
module.exports = { db };