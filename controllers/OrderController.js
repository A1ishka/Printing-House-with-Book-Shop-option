import UserModel from '../models/User.js';
import PreOrderSchema from '../models/PreOrder.js';
import OrderSchema from '../models/Order.js';


const IIsOrderCreated = async function(req, res){	
	const findOrder = await OrderSchema.findOne({ userId: req.params.userId });
    const preorderData = req.PreOrder;
	if (!findOrder || findOrder.status != "Формируется..") {
        try {
            const result = await createOrder(preorderData);;
            res.send(result);
          } catch (error) {
            console.error(error);
            res.render('./500.ejs');
          }
    }
	else {
        try {
            const result = await addToOrder(preorderData);
            res.send(result);
          } catch (error) {
            console.error(error);
            res.render('./500.ejs');
          }
    }
        addToOrder(preorderData, res);
}

export const isOrderCreated = function(){ return IIsOrderCreated; };

export const showOrder = async (req, res) => {
//получаем в фронте???<!--findById(user.userId : user._id)-->

const findOrder = await OrderSchema.findOne({ userId: req.params.id });//????
};


async function createOrder (preorderData){
	try {
	const findUser = await UserModel.findById(req.userId);
    let PreOrder = []
    PreOrder.push(preorderData);
    const doc = new OrderSchema({
      preOrder: PreOrder,
      user: {
		orderName: req.body.orderName,
      	userId: findUser,}
    });
    const newOrder = await doc.save();
	return newOrder;
} catch (err) { throw err; }
};

async function addToOrder (preorderData){
	try {
    const findOrder = await OrderSchema.findById(req.body.order);
	let isEqual = true;
	console.log(preorderData._id);
	findOrder.preOrder.forEach ((element) => {

	if (JSON.stringify(element._id) === JSON.stringify(preorderData._id)) {
		isEqual = false;
		res.json({message: 'Уже добавлено. Проверьте содержимое корзины'});
	}console.log(isEqual);});

	if (isEqual == true) {
    findOrder.preOrder.push(preorderData);
    findOrder.save();
    return findOrder;}
} catch (err) { throw err; }
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