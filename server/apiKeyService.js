import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';

// Configure your SQL Server connection (update with your credentials)
const config = {
  user: "if0_36033472",
  password: "ayushkumr2003",
  host: "sql213.infinityfree.com", // e.g., 'localhost'
  database: "if0_36033472_api"
};
connection.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL!');
});
// Connect pool (reuse connection)
let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

// Generate and store a new API key
export async function generateApiKey(userName) {
    try {
      const apiKey = uuidv4();
      const pool = await getPool();
  
      await pool.request()
        .input('ApiKey', sql.VarChar(100), apiKey)
        .input('UserName', sql.VarChar(100), userName)
        .query(`
          INSERT INTO apikeys (ApiKey, UserName)
          VALUES (@ApiKey, @UserName)
        `);
  
      return apiKey;
    } catch (err) {
      console.error('Error in generateApiKey:', err);
      throw err; // rethrow to catch in route
    }
  }
  

// Validate API key (check if exists and not revoked)
export async function validateApiKey(apiKey) {
  const pool = await getPool();

  const result = await pool.request()
    .input('ApiKey', sql.VarChar(100), apiKey)
    .query(`
      SELECT UserName FROM apikeys
      WHERE ApiKey = @ApiKey AND Revoked = 0
    `);

  if (result.recordset.length === 0) {
    return null; // Invalid or revoked
  }

  return result.recordset[0].UserName;
}

// Revoke API key (soft delete)
export async function revokeApiKey(apiKey) {
  const pool = await getPool();

  const result = await pool.request()
    .input('ApiKey', sql.VarChar(100), apiKey)
    .query(`
      UPDATE apikeys SET Revoked = 1
      WHERE ApiKey = @ApiKey AND Revoked = 0
    `);

  return result.rowsAffected[0] > 0; // true if revoked, false if not found
}
