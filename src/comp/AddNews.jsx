import { useState } from 'react';
import { getDatabase, ref, push, set } from "firebase/database";
import { initializeApp } from "firebase/app";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBABanc9qyPW098eqGNAm0YsKW9aA9e0Z0",
  authDomain: "ayush-d1675.firebaseapp.com",
  databaseURL: "https://ayush-d1675-default-rtdb.firebaseio.com",
  projectId: "ayush-d1675",
  storageBucket: "ayush-d1675.firebasestorage.app",
  messagingSenderId: "1091620849392",
  appId: "1:1091620849392:web:5feb74c720bdc79ed56435",
  measurementId: "G-N0PCCCYRST"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const AddNews = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: '',
    publishedAt: new Date().toISOString().split('T')[0],
    tags: '',
    sourceUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const newsData = {
      title: formData.title,
      content: formData.content,
      author: {
        name: formData.authorName
      },
      publishedAt: new Date(formData.publishedAt).toISOString(),
      tags: formData.tags.split(',').map(tag => tag.trim()),
      sourceUrl: formData.sourceUrl,
      createdAt: new Date().toISOString()
    };

    try {
      // Option 1: Store via your API (recommended with API key)
      const apiResponse = await fetch('http://localhost:3000/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'e7a7d3fd-9e9c-405e-95c9-71e793d2aa0f'
        },
        body: JSON.stringify(newsData)
      });

      if (!apiResponse.ok) {
        throw new Error('API request failed');
      }

      // Option 2: Direct Firebase storage (as fallback)
      const newsRef = ref(database, 'news');
      const newNewsRef = push(newsRef);
      await set(newNewsRef, newsData);

      setSuccess('News published via API and stored in Firebase!');
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to publish news');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      authorName: '',
      publishedAt: new Date().toISOString().split('T')[0],
      tags: '',
      sourceUrl: ''
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="news-form">
      <h2>Create News Article</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Author Name*</label>
          <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Published Date*</label>
          <input
            type="date"
            name="publishedAt"
            value={formData.publishedAt}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="technology, business, sports"
          />
        </div>

        <div className="form-group">
          <label>Source URL</label>
          <input
            type="url"
            name="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleChange}
            placeholder="https://example.com/news"
          />
        </div>

        <div className="form-group">
          <label>Content*</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
};

export default AddNews;
