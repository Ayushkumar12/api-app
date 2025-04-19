import { useState } from "react";

function AccessData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("e7a7d3fd-9e9c-405e-95c9-71e793d2aa0f"); // Replace with your API key

  async function fetchProtectedData() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("http://localhost:3000/protected-data", {
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Helper to format date string nicely
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "1rem" }}>
      <h2>Fetch Protected News Data</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          API Key:{" "}
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <button onClick={fetchProtectedData} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Loading..." : "Get Protected Data"}
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>Error: {error}</p>}

      {data && data.data && data.data.length > 0 ? (
        <div style={{ marginTop: "2rem" }}>
          <h3>Latest News</h3>
          {data.data.map((newsItem) => (
            <div
              key={newsItem.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: "1rem",
                marginBottom: "1rem",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem 0" }}>{newsItem.title || "Untitled"}</h4>
              <p style={{ margin: "0 0 0.5rem 0", fontStyle: "italic", color: "#555" }}>
                By {newsItem.author?.name || newsItem.author || "Unknown Author"} |{" "}
                {newsItem.publishedAt ? formatDate(newsItem.publishedAt) : "Unknown Date"}
              </p>
              <p style={{ whiteSpace: "pre-wrap" }}>{newsItem.content || "No content available."}</p>
              {newsItem.sourceUrl && (
                <p>
                  Source:{" "}
                  <a href={newsItem.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {newsItem.sourceUrl}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : data && data.data && data.data.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>No news available.</p>
      ) : null}
    </div>
  );
}

export default AccessData;
