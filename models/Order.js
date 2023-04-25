import mongoose from 'mongoose';

const OrderSchema = new Schema({
	products: [
		{
			product: {
				type: Object,
				required: true
			},
			quantity: {
				type: Number,
				required: true
			}
		}
	],
	user: {
		name: { type: String, required: true },
		userId: {
			//type: Schema.Types.ObjectId, если производить помодульное подключение
            type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		}
	}
});

export default mongoose.model("Order", OrderSchema);