import cors from 'cors';
import express from 'express';
import { generateApiKey, validateApiKey, revokeApiKey } from './apiKeyService.js';

const app = express();
app.use(express.json(),cors());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
// Generate API key
app.post('/generate-key', async (req, res) => {
    try {
      console.log('Request body:', req.body); // Check what frontend sends
  
      const userName = req.body.userName || 'anonymous';
      const apiKey = await generateApiKey(userName);
  
      res.json({ apiKey, message: `API key generated for ${userName}` });
    } catch (err) {
      console.error('Error in /generate-key:', err.stack || err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Middleware to validate API key
async function validateApiKeyMiddleware(req, res, next) {
  const apiKey = req.header('x-api-key');
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key' });
  }
  try {
    const userName = await validateApiKey(apiKey);
    if (!userName) {
      return res.status(401).json({ error: 'Invalid or revoked API key' });
    }
    req.userName = userName;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Error validating API key' });
  }
}

// Protected route example
app.get('/protected-data', validateApiKeyMiddleware, (req, res) => {
  res.json({ data: 'This is protected data', user: req.userName });
});

// Revoke API key
app.delete('/revoke-key', async (req, res) => {
  const apiKey = req.query.apiKey;
  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }
  try {
    const revoked = await revokeApiKey(apiKey);
    if (revoked) {
      res.json({ message: 'API key revoked successfully' });
    } else {
      res.status(404).json({ error: 'API key not found or already revoked' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
});

// Start server
const PORT = 8080 || 5173;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
