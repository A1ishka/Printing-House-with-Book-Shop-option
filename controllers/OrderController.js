import UserModel from '../models/User.js';
import PreOrderSchema from '../models/PreOrder.js';
import OrderSchema from '../models/Order.js';


export const isOrderCreated = async (req, res) => {	
	const findOrder = await OrderSchema.findOne({ userId: req.params.userId });
	if (!findOrder || findOrder.status != "Формируется..") createOrder();
	else addToOrder();
};

export const showOrder = async (req, res) => {
//получаем в фронте???<!--findById(user.userId : user._id)-->

const findOrder = await OrderSchema.findOne({ userId: req.params.id });//????
};

export const createOrder = async (req, res) => {
	try {
	const findUser = await UserModel.findById(req.userId);
	const findPreOrder = await PreOrderSchema.findById(req.body._id); 
    let PreOrder = []
    PreOrder.push(findPreOrder);
    const doc = new OrderSchema({
      preOrder: PreOrder,
      user: {
		orderName: req.body.orderName,
      	userId: findUser,}
    });

    const newOrder = await doc.save();
	res.json(newOrder);
} catch (err) {
	console.log(err);
    res.render('./500.ejs');
}
};

export const addToOrder =  async (req, res) => {
	try {
    const findOrder = await OrderSchema.findById(req.body.order);
	const findPreOrder = await PreOrderSchema.findById(req.body._id); 
	
	let isEqual = true;
	console.log(findPreOrder._id);
	findOrder.preOrder.forEach ((element) => {

	if (JSON.stringify(element._id) === JSON.stringify(findPreOrder._id)) {
		isEqual = false;
		res.json({message: 'Уже добавлено. Проверьте содержимое корзины'});
	}console.log(isEqual);});

	if (isEqual == true) {
    findOrder.preOrder.push(findPreOrder);
    findOrder.save();
	res.json({findOrder}); }
} catch (err) {
	console.log(err);
    res.render('./500.ejs');}
};

export const removeFromOrder =  async (req, res) => { //обработчик кнопки "убрать из заказа" + проверка (если это был единственный предзаказ в заказе...)
	try {
    const findOrder = await OrderSchema.findById(req.body.order);
	const findPreOrder = await PreOrderSchema.findById(req.body.preOrder); 
    findOrder.preOrder.pop(findPreOrder);
    findOrder.save();
	res.json({findOrder});
} catch (err) {
	console.log(err);
    res.render('./500.ejs');}
};

export const changeStatus =  async (req, res) => { //кнопка оплаты
	try {
    const findOrder = await OrderSchema.findById(req.body.orderId);
	if (findOrder.status == "К оплате") findOrder.status = "Оплачено";
	if (findOrder.status == "Формируется..") findOrder.status = "К оплате";
    findOrder.save();
	res.json({ success: true, });
} catch (err) {
	console.log(err);
    res.render('./500.ejs');}
};

export const getOrderById = async (req, res) => {
    try {
      const findOrder = await OrderSchema.findOne({ _id: req.params.id });
      if (!findOrder) {
        return res.render('./404.ejs');;
      }
      res.json(findOrder);
    } catch (err) {
      console.log(err);
      res.render('./500.ejs');
    }
};