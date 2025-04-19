import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

const sql = neon('postgresql://neondb_owner:npg_K6dWN3ynMBvO@ep-dry-heart-a82cvn6l-pooler.eastus2.azure.neon.tech/api?sslmode=require');

// Generate and store a new API key
export async function generateApiKey(userName) {
  const apiKey = uuidv4();
  await sql`
    INSERT INTO apikeys (ApiKey, UserName, Revoked)
    VALUES (${apiKey}, ${userName}, false)
  `;
  return apiKey;
}

// Validate API key
export async function validateApiKey(apiKey) {
  const result = await sql`
    SELECT UserName FROM apikeys
    WHERE ApiKey = ${apiKey} AND Revoked = false
  `;
  if (result.length === 0) return null;
  return result[0].username;
}

// Revoke API key
export async function revokeApiKey(apiKey) {
  const result = await sql`
    UPDATE apikeys SET Revoked = true
    WHERE ApiKey = ${apiKey} AND Revoked = false
  `;
  return result.count > 0; // result.count is number of rows updated
}
