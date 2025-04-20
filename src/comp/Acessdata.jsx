import { useState } from 'react';

function AccessData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiKey = "e7a7d3fd-9e9c-405e-95c9-71e793d2aa0f";

  async function fetchProtectedData() {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/protected-data', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey 
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      const result = await response.json();
      setData({
        userName: result.user,
        news: Object.entries(result.news || {}).map(([id, article]) => ({
          id,
          ...article
        }))
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'No date available';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>News Dashboard</h2>
      <button 
        onClick={fetchProtectedData} 
        disabled={loading || !apiKey}
        style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none' }}
      >
        {loading ? 'Loading...' : 'Fetch News'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 15 }}>Error: {error}</p>}

      {data && (
        <div style={{ marginTop: 30 }}>
          <h3>Welcome, {data.userName || 'User'}</h3>
          
          {data.news.length === 0 ? (
            <p>No articles found</p>
          ) : (
            data.news.map(article => (
              <article key={article.id} style={{ 
                marginBottom: 20, 
                padding: 20, 
                border: '1px solid #ddd',
                borderRadius: 8
              }}>
                <h4>{article.title || 'Untitled Article'}</h4>
                <p style={{ color: '#666' }}>
                  By {article.author?.name || 'Unknown'} • {formatDate(article.publishedAt)}
                </p>
                <p style={{ margin: '15px 0' }}>{article.content || 'No content available'}</p>
                {article.tags?.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    {article.tags.map(tag => (
                      <span key={tag} style={{ 
                        display: 'inline-block',
                        background: '#eee',
                        padding: '3px 8px',
                        marginRight: 8,
                        borderRadius: 4,
                        fontSize: 14
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {article.sourceUrl && (
                  <a 
                    href={article.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', display: 'inline-block', marginTop: 10 }}
                  >
                    View Source
                  </a>
                )}
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AccessData;
