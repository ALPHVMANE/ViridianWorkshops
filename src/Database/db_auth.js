// const admin = require('firebase-admin');
// const fs = require('fs');

// // Initialize Firebase Admin SDK
// const serviceAccount = require('./firebase-admin.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


// const express = require('express');
// const app = express();
// // Function to list all users
// app.get('/listUsers', async (req, res) => {
//   try {
//     const listUsersResult = await admin.auth().listUsers();
//     const users = listUsersResult.users.map(user => ({
//       uid: user.uid,
//       email: user.email,
//       displayName: user.displayName || '',
//       phoneNumber: user.phoneNumber || '',
//       photoURL: user.photoURL || '',
//       customClaims: user.customClaims || {}
//     }));

//     res.json(users);
//   } catch (error) {
//     res.status(500).send('Error fetching user data:', error.message);
//   }
// });
// // Start server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
