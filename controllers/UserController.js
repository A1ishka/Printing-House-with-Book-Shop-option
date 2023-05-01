import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';
import RoleModel from '../models/Role.js';

export const register = async (req, res) => {
  try {

  /*const userRole = new RoleModel();
  const adminRole = new RoleModel({value:"ADMIN"})
  await userRole.save()
  await adminRole.save()
  res.json('added')*/

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const userRole = await RoleModel.findOne({value: "USER"});


    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
      role: userRole.value,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'printingBooks',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'printingBooks',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

/*
exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: "Déconnexion réussie !" })
}

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;

    if (!user) {
        return res.status(403).json({
            error: 'Accès refusé'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Réservé aux Admins! Access denied"
        });
    }
    next();
}
*/

///////////////////////////////////////////////
/*UserModel.methods.addToCart = function(bookId) {
	const cartBookInd = this.cart.items.findIndex((cp) => {
		return cp.bookId == bookId;
	});
	let updatedCart;
	if (cartBookInd === -1) {
		updatedCart = {
			items: [...this.cart.items, { bookId: bookId, quantity : 1 }]
		};
	}
	else {
		const cartBook = this.cart.items[cartBookInd];
		cartBook.quantity += 1;
		const newItems = this.cart.items;
		newItems[cartBookInd] = cartBook;
		updatedCart = { items: [...newItems] };
	}
	console.log(updatedCart);
	this.cart = updatedCart;
	return this.save();
};

UserModel.methods.getCart = function() {
	return this.cart.populate("items.bookId");
};

UserModel.methods.removeBookCart = function(bookId) {
	const newCartItems = this.cart.items.filter(
		(item) => item.bookId.toString() !== bookId.toString()
	);
	this.cart.items = newCartItems;
	return this.save();
};

UserModel.methods.addOrder = function() {
	let cartItems = [];
	return this.cart.populate("items.bookId").then((cart) => {
		cartItems = cart.items.map((prod) => ({
			quantity: prod.quantity,
			book : prod.bookId.toObject()
			}));
		console.log("this is the cart items", cartItems);
		const order = new Order({
			books: cartItems,
			user : {
				name: this.username,
				userId : this._id
			}
			});
		console.log(order);
		return order.save();
	})
		.then(() => {
		this.cart.items = [];
		return this.save();
	})
		.catch ((err) => console.log(err));
};

UserModel.methods.getOrders = function() {
	return Order.find({ "user.userId": this._id });
};*/