// models/book.models.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  pages: Number,
  difficulty: String,
  rating: Number,
  description: String,
  publishYear: Number,
  discussionTopics: [String],
  link: String // 👈 Add this
});

export default mongoose.model('Book', bookSchema);

