import mongoose from 'mongoose';
import PreOrderSchema from './PreOrder.js'

const OrderSchema = new mongoose.Schema({
	preOrder:[{    
    	type: mongoose.Schema.Types.ObjectId,
		ref: "PreOrder",
		required: true,
  }],
	user: {
		orderName: { type: String, required: true },
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

/*
  OrderSchema.methods.addToOrder = function(){
    async (req, res) => {
	try {
    let findOrder = this.Order;
	//const findOrder = await OrderSchema.findById(req.Order);
	const findPreOrder = await PreOrderSchema.findById(req.body.order); 
    const doc = findOrder.order.items.push({order: findPreOrder});

    const addToOrder = await doc.save();
	res.json(addToOrder);
} catch (err) {
	console.log(err);
    res.status(500).json({
      message: 'Не удалось добавить в заказ',
    });
}
}
}*/

export default mongoose.model("Order", OrderSchema);