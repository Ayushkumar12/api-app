import { generateApiKey } from './apiKeyService.js';

(async () => {
  try {
    const testKey = await generateApiKey('testuser');
    console.log('Test API Key generated:', testKey);
  } catch (err) {
    console.error('Error generating API key in test:', err);
  }
})();
