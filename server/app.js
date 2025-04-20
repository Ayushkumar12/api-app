import cors from 'cors';
import { initializeApp } from "firebase/app";
import express from 'express';
import { getDatabase, ref, get, push, set } from "firebase/database";
import { generateApiKey, validateApiKey, revokeApiKey } from './apiKeyService.js';

// Firebase config hardcoded (not recommended for production)
const firebaseConfig = {
  apiKey: "AIzaSyBABanc9qyPW098eqGNAm0YsKW9aA9e0Z0",
  authDomain: "ayush-d1675.firebaseapp.com",
  databaseURL: "https://ayush-d1675-default-rtdb.firebaseio.com",
  projectId: "ayush-d1675",
  storageBucket: "ayush-d1675.appspot.com",
  messagingSenderId: "1091620849392",
  appId: "1:1091620849392:web:5feb74c720bdc79ed56435",
  measurementId: "G-N0PCCCYRST"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const dbRef = ref(database);


const app = express();
app.use(express.json());

// CORS config hardcoded
const allowedOrigins = ['http://localhost:3000'];
app.use(cors());

// Generate API key
app.post('/generate-key', async (req, res) => {
  try {
    const userName = req.body.userName || 'anonymous';
    const apiKey = await generateApiKey(userName);
    res.json({ apiKey, message: `API key generated for ${userName}` });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add news article
app.post('/news', async (req, res) => {
  try {
    const newsData = req.body;
    const newsRef = ref(database, 'news');
    const newNewsRef = push(newsRef);
    await set(newNewsRef, newsData);
    res.status(201).json({ 
      message: "News added", 
      id: newNewsRef.key,
      data: newsData
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to add news' });
  }
});

// API key validation middleware
async function validateApiKeyMiddleware(req, res, next) {
  const apiKey = req.header('x-api-key');
  if (!apiKey) return res.status(401).json({ error: 'API key required' });
  
  try {
    const userName = await validateApiKey(apiKey);
    if (!userName) return res.status(403).json({ error: 'Invalid API key' });
    req.userName = userName;
    next();
  } catch (err) {
    console.error('Validation error:', err);
    res.status(500).json({ error: 'Key validation failed' });
  }
}

// Protected data endpoint
app.get('/protected-data', validateApiKeyMiddleware, async (req, res) => {
  try {
    // Example: Fetch all news articles from Firebase Realtime Database
    const newsRef = ref(database, 'news');
    const snapshot = await get(newsRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'No news found' });
    }

    // Return the data along with the authenticated userName
    res.json({
      message: 'Protected data access granted',
      news: snapshot.val()
    });
  } catch (err) {
    console.error('Error fetching protected data:', err);
    res.status(500).json({ error: 'Failed to fetch protected data' });
  }
});

// app.get('/protected-data', (req, res) => {
// const newsRef = child(dbRef, 'news');
// get(newsRef)
//   .then((data) => {
//     if (data.exists()) {
//       res.send(data.val());
//     } else {
//       res.status(404).send({ message: 'No items found' });
//     }
//   })
//   .catch((error) => {
//     res.status(500).send({ message: 'Error retrieving data' });
//   });

// });

// Revoke API key
app.delete('/revoke-key', async (req, res) => {
  try {
    const apiKey = req.query.apiKey;
    if (!apiKey) return res.status(400).json({ error: 'API key required' });
    
    const revoked = await revokeApiKey(apiKey);
    if (revoked) {
      res.json({ message: 'API key revoked' });
    } else {
      res.status(404).json({ error: 'Key not found' });
    }
  } catch (err) {
    console.error('Revoke error:', err);
    res.status(500).json({ error: 'Revocation failed' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Hardcoded port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
