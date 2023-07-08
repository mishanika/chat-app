const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const credentials = require("./firebase-credentials");

module.exports = admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://chat-ce59a-default-rtdb.europe-west1.firebasedatabase.app",
});

const database = getFirestore();
module.exports = database;
