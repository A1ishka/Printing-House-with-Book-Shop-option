/*const Book = require("../models/Book");

export const getBooks = (req, res, next) => {
	Book.find().then((books) => {
		console.log(books);
		res.render("shop/book-list", {
			book_s: books,
			pageTitle : "All Books",
			path : "/books"
			});
	})
		.catch ((err) => {
		console.log(err);
	});
};

export const getBook = (req, res, next) => {
	const book_Id = req.params.bookId;
	Book.findById(book_Id).then((book) => {
		res.render("shop/book-detail", {
			book: book,
			pageTitle : book.title,
			path : "/books"
			});
	})
		.catch ((err) => console.log(err));
};

export const getIndex = (req, res, next) => {
	Book.find().then((books) => {
		res.render("shop/index", {
			book_s: books,
			pageTitle : "Shop",
			path : "/"
			});
	})
		.catch ((err) => {
		console.log(err);
	});
};

export const getCart = (req, res, next) => {
	req.user.getCart().then((cart) => {
		console.log(cart);
		res.render("shop/cart", {
			books: cart.items,
			pageTitle : "Cart",
			path : "/cart"
			});
	})
		.catch ((err) => {
		console.error(err);
	});
};

export const postCart = (req, res, next) => {
	const book_Id = req.body.bookId;
	req.user.addToCart(book_Id).then(() => {
		res.redirect("/cart");
	})
		.catch ((err) => console.log(err));
};

export const postCartDeleteBook = (req, res, next) => {
	const book_Id = req.body.bookId;
	req.user.removeBookCart(book_Id).then((result) => {
		console.log(result);
		res.redirect("/cart");
	})
		.catch ((err) => console.log(err));
};

export const postOrder = (req, res, next) => {
	req.user.addOrder().then((result) => {
		res.redirect("/orders");
	})
		.catch ((err) => console.log(err));
};

export const getOrders = (req, res, next) => {
	req.user.getOrders().then((orders) => {
		res.render("shop/orders", {
			path: "/orders",
			pageTitle : "Your Orders",
			orders : orders
			});
	})
		.catch ((err) => console.log(err));
};
*/

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