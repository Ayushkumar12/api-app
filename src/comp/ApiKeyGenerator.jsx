import React, { useState } from 'react';

function ApiKeyGenerator() {
  const [userName, setUserName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setApiKey('');

    try {
        const response = await fetch("http://localhost:3000/generate-key", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' },
                body: JSON.stringify({ userName }),
        });    

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate API key');
      setApiKey(data.apiKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Generate New API Key</h2>
      <form onSubmit={handleGenerate}>
        <label>
          User Name:
          <input
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="Enter your name"
            style={{ marginLeft: 8 }}
          />
        </label>
        <button type="submit" disabled={loading} style={{ marginLeft: 12 }}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {apiKey && (
        <div style={{ marginTop: 16, color: 'green' }}>
          <strong>Your API Key:</strong>
          <pre style={{ background: '#f4f4f4', padding: 8 }}>{apiKey}</pre>
        </div>
      )}
      {error && (
        <div style={{ marginTop: 16, color: 'red' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default ApiKeyGenerator;
