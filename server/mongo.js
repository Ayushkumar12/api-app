const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  content: { type: String, required: true },
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user collection
    name: { type: String, required: true } // Denormalized for query efficiency
  },
  publishedAt: { type: Date, required: true, index: true },
  tags: [String], // Array of tags for categorization, optional
  comments: [CommentSchema], // Embedded comments (small, related data)
  sourceUrl: { type: String }, // Optional source link
  isActive: { type: Boolean, default: true } // For soft deletes or archiving
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

// Indexes to optimize queries on publishedAt and title
NewsSchema.index({ publishedAt: -1 }); // For sorting latest news
NewsSchema.index({ title: "text" }); // For text search on title

module.exports = mongoose.model('News', NewsSchema);
