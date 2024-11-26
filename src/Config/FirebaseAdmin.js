const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.REACT_APP_DATABASE_URL
});

module.exports = admin;