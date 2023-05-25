import UserModel from '../models/User.js';
import PreOrderSchema from '../models/PreOrder.js';
import OrderSchema from '../models/Order.js';
import BookSchema from '../models/Book.js'

export const preOrderCr = async function(req, res){	
  try {
    const book = await BookSchema.findById(req.body.bookId); 
    const doc = new PreOrderSchema({
          bookId: book,
          bookName: book.name,
          bookPrice: book.price,
          imageUrl: book.imageUrl,
          quantity: req.body.quantity 
      });
  
    if (book.count >= doc.quantity) 
      { book.count -= doc.quantity;
        await book.save(); }
    const preorderData = await doc.save();
     //закончили создание преордера, переходим к ордеру
  const order = await OrderSchema.findOne({
    'user.userId': req.userId,
    status: 'Формируется..'
  }).exec(); 
  
  if (order) {
    const result = await addToOrder(preorderData, order);
    if(result == null){ res.json({message: 'Уже добавлено. Проверьте содержимое корзины'}); }
    else res.send(result);
    console.log('User has an order with status "In process"');
  } else {
    const result = await createOrder(preorderData, req.userId);;
    res.send(result);
    console.log('User does not have an order with status "In process"');
    }
  } catch (error) {
    console.error(error);
    res.render('./errors/500.ejs');
  }
}

export const showOrder = async (req, res) => {
try {
  const orders = await OrderSchema.find({
    'user.userId': req.userId,
    status: 'Формируется..' && 'К оплате'
  }).exec(); 
  const preOrderIds = orders.flatMap((order) => order.preOrder);
  const preOrders = await PreOrderSchema.find({ _id: { $in: preOrderIds } }).exec();
  res.render('cart', { orders: orders, preOrders: preOrders });
} catch (err) {
  console.log(err);
  res.render('./500.ejs');
}};

export const showSavedOrder = async (req, res) => {
  try {
    const orders = await OrderSchema.find({
      'user.userId': req.userId,
      status: 'Оплачено'
    }).exec(); 
    const preOrderIds = orders.flatMap((order) => order.preOrder);
    const preOrders = await PreOrderSchema.find({ _id: { $in: preOrderIds } }).exec();
    res.render('cart-history', { orders: orders, preOrders: preOrders });
  } catch (err) {
    console.log(err);
    res.render('./500.ejs');
  }};

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

async function addToOrder (preorderData, order){
	try {
	let isEqual = true;
	order.preOrder.forEach (async (element) =>  {
  const findPreOrder = await PreOrderSchema.findOne({ _id: element }); 
	if (JSON.stringify(findPreOrder.bookId) == JSON.stringify(preorderData.bookId._id)) {
		isEqual = false;
	}});

	if (isEqual == true) {
    order.preOrder.push(preorderData);
    await order.save();
    return order;
  } else return null;
} catch (err) { throw err; }
};

export const removeFromOrder =  async (req, res) => {
	try {
    const findOrder = await OrderSchema.findById(req.body.orderId);
	  const findPreOrder = await PreOrderSchema.findById(req.params.preOrderId); 
    findOrder.preOrder.pop(findPreOrder);
    findOrder.save();
	  res.json({findOrder});
  } catch (err) {
	  console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const changeStatus =  async (req, res) => { //кнопка оплаты
	try {
    const findOrder = await OrderSchema.findById(req.params.orderId);
	if (findOrder.status == "Формируется..") findOrder.status = "К оплате";
    findOrder.save();
	res.json({ success: true, });
} catch (err) {
	console.log(err);
    res.render('./errors/500.ejs');}
};

export const changeStatusToDelete =  async (req, res) => {
	try {
    const findOrder = await OrderSchema.findById(req.params.orderId);
	  findOrder.status = "Удалено";
    findOrder.save();
	res.json({ success: true, });
} catch (err) {
	console.log(err);
    res.render('./errors/500.ejs');}
};

export const changeStatusToPaid =  async (req, res) => {
	try {
    const findOrder = await OrderSchema.findById(req.params.orderId);
	  findOrder.status = "Оплачено";
    findOrder.save();
    res.render('cart', { PAIDstatus: findOrder.status });
} catch (err) {
	console.log(err);
    res.render('./errors/500.ejs');}
};

export const changeAdress =  async (req, res) => { //кнопка оплаты
	try {
    const findOrder = await OrderSchema.findById(req.params.orderId);
    findOrder.user.Adress = req.body.Adress;
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