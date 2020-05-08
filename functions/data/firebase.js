const admin = require('firebase-admin');
let serviceAccount = require('../credentials/marcatel-bot-firebase-adminsdk-4jvz8-2fb01dc55e');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = {db}
