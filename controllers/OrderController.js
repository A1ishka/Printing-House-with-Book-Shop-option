import UserModel from '../models/User.js';
import PreOrderSchema from '../models/PreOrder.js';
import OrderSchema from '../models/Order.js';
import BookSchema from '../models/Book.js'

export const preOrderCr = async function(req, res){	
  try {
    const book = await BookSchema.findById(req.body.bookId); 
    console.log(book);
    const doc = new PreOrderSchema({
          bookId: book,
          bookName: book.name,
          bookPrice: book.price,
          quantity: req.body.quantity 
      });
  
    if (book.count >= doc.quantity) 
      { book.count -= doc.quantity;
        await book.save(); }
    const preorderData = await doc.save();
     //закончили создание преордера, переходим к ордеру
  const findOrder = await OrderSchema.find(req.params.userId).exec();
  let flag = false;
  if (findOrder){
  findOrder.forEach((orders) => async (res, req) => {if (orders.status == "Формируется..") {
    const result = await addToOrder(preorderData, orders);
    flag = true;
    res.send(result);
  }})}
  if (flag == false) {
    try {
      const user = await UserModel.findById(req.userId);
      const result = await createOrder(preorderData, user);;
      res.send(result);
      } catch (error) {
        console.error(error);
        res.render('./errors/500.ejs');
      }
    }
  } catch (error) {
    console.error(error);
    res.render('./errors/500.ejs');
  }
}

export const showOrder = async (req, res) => {
//получаем в фронте???<!--findById(user.userId : user._id)-->

const findOrder = await OrderSchema.findOne({ userId: req.params.id });//????
};


async function createOrder (preorderData, user){
	try {
    let PreOrder = []
    PreOrder.push(preorderData);
    const doc = new OrderSchema({
      preOrder: PreOrder,
      user: {	userId: user, }
    });
    const newOrder = await doc.save();
	return newOrder;
} catch (err) { throw err; }
};

async function addToOrder (preorderData, orders){
	try {
	let isEqual = true;
	console.log(preorderData._id);
	orders.preOrder.forEach ((element) => {
	  if (JSON.stringify(element._id) === JSON.stringify(preorderData._id)) {
		  isEqual = false;
		  res.json({message: 'Уже добавлено. Проверьте содержимое корзины'});
	  }
    console.log(isEqual);
  });

	if (isEqual == true) {
    orders.preOrder.push(preorderData);
    await orders.save();
    return orders;}
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
    res.render('./errors/500.ejs');}
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
    res.render('./errors/500.ejs');}
};

export const getOrderById = async (req, res) => {
    try {
      const findOrder = await OrderSchema.findOne({ _id: req.params.id });
      if (!findOrder) {
        return res.render('./errors/404.ejs');;
      }
      res.json(findOrder);
    } catch (err) {
      console.log(err);
      res.render('./errors/500.ejs');
    }
};