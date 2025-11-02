import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  totalCopies: {
    type: Number,
    default: 1,
    min: 1
  },
  availableCopies: {
    type: Number,
    default: 1,
    min: 0
  },
  borrowedCopies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    borrowedDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Book', bookSchema);