import React, { useState } from 'react';
import axios from 'axios';

const AddNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newsData = {
        title,
        content,
        author: { name: authorName },
        publishedAt: new Date(publishedAt),
      };

      const response = await axios.post('http://localhost:3000/news', newsData);
      if (response.status === 201) {
        setMessage('News added successfully!');
        // Clear form
        setTitle('');
        setContent('');
        setAuthorName('');
        setPublishedAt('');
      }
    } catch (error) {
      console.error('Error adding news:', error);
      setMessage('Failed to add news.');
    }
  };

  return (
    <div>
      <h2>Add Latest News</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label><br />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Author Name:</label><br />
          <input
            type="text"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Published At:</label><br />
          <input
            type="date"
            value={publishedAt}
            onChange={e => setPublishedAt(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add News</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddNews;
