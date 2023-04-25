import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      //default: 0,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
      type: Number,
      required: true
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
