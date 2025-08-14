import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    
  },
  author: {
    type: String,
    required: true,
    
  },
  publicationYear: {
    type: Number,
    required: true,
    min: [1450, 'Publication year must be after 1450'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  genre: {
    type: String,
    required: true,
    
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  numberOfPages: {
    type: Number,
    min: [1, 'Number of pages must be at least 1']
  },
  series: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series'
  }
}, {
  timestamps: true
});


bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;
