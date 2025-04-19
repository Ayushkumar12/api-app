// NewsApp.jsx
import React, { useEffect, useState } from "react";
import { dataConnect, auth } from "./firebasecofig";
import { onAuthStateChanged } from "firebase/auth";

function NewsApp() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    // Wait for auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchNews();
      }
    });
    return () => unsubscribe();
  }, []);

  async function fetchNews() {
    setLoading(true);
    setError(null);

    try {
      // Use the generated SDK to query news
      const result = await dataConnect.query({
        query: `
          query {
            news {
              id
              title
              author
              content
              publishedAt
              sourceUrl
            }
          }
        `
      });

      setNews(result.data.news);
    } catch (e) {
      setError("Failed to fetch news: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function addNews() {
    if (!newTitle.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const publishedAt = new Date().toISOString();

      const result = await dataConnect.mutate({
        mutation: `
          mutation AddNews($title: String!, $author: String, $content: String, $publishedAt: Timestamp!) {
            addNews(title: $title, author: $author, content: $content, publishedAt: $publishedAt) {
              id
              title
              author
              content
              publishedAt
            }
          }
        `,
        variables: {
          title: newTitle,
          author: newAuthor,
          content: newContent,
          publishedAt,
        }
      });

      setNews((prev) => [result.data.addNews, ...prev]);
      setNewTitle("");
      setNewAuthor("");
      setNewContent("");
    } catch (e) {
      setError("Failed to add news: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>News App with Firebase Data Connect</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Author"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={4}
          style={{ width: "100%" }}
        />
        <button onClick={addNews} disabled={loading} style={{ marginTop: 8 }}>
          {loading ? "Adding..." : "Add News"}
        </button>
      </div>

      <button onClick={fetchNews} disabled={loading}>
        {loading ? "Loading..." : "Reload News"}
      </button>

      <ul style={{ marginTop: 20, listStyle: "none", padding: 0 }}>
        {news.map((item) => (
          <li key={item.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
            <h3>{item.title}</h3>
            <p><em>By {item.author || "Unknown"}</em></p>
            <p>{item.content}</p>
            <small>{new Date(item.publishedAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsApp;
