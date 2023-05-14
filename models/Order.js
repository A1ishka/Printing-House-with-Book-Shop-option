import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
	preOrder:[{    
    	type: mongoose.Schema.Types.ObjectId,
		ref: "PreOrder",
		required: true,
  }],
	user: {
		orderName: { type: String, },
		userId: {
            type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		}
	},
  status: {
    type: String,
    default: "Формируется.."
  }
	},
	{
    timestamps: true,
  	},
  );

export default mongoose.model("Order", OrderSchema);