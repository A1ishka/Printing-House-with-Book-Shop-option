import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    pageCount: {
      type: Number,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      default: 100
    },
    /*user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },*/
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Book', BookSchema);
