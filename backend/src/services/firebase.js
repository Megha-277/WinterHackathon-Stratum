const admin = require("firebase-admin");
const path = require("path");

// Pointing to the key in your root directory
const serviceAccount = require(path.join(__dirname, "../../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log("🔥 Saarthi is connected to the project:", serviceAccount.project_id);

module.exports = { db };