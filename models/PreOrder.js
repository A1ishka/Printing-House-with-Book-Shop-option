import mongoose from 'mongoose';

const PreOrderSchema = new mongoose.Schema({
	bookId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Book",
		required: true,
	},
	bookName: {
		type: String,
	},
	bookPrice:{
		type: Number,
	},
    imageUrl: {
		type: String,
	},
	quantity: {
		type: Number,
		default: 1,
	},
	},
  );

export default mongoose.model("PreOrder", PreOrderSchema);