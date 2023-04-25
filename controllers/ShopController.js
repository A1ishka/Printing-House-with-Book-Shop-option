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