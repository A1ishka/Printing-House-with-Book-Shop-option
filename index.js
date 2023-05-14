import express from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import * as Validations from './validations/auth.js';

import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import * as UserController from './controllers/UserController.js';
import * as BookController from './controllers/BookController.js';
import * as RoleController from './controllers/RoleController.js';
import * as PreOrderController from './controllers/PreOrderController.js';
import * as OrderController from './controllers/OrderController.js';
import * as TOrderController from './controllers/TOrderController.js';
import cookieParser from 'cookie-parser';

mongoose
.connect('mongodb+srv://alika:qv8GdxBfWhxHT5YE@cluster0.kpu7dbl.mongodb.net/book?retryWrites=true&w=majority')
.then(()=> console.log('DB is OK'))
.catch((err)=> console.log('DB error', err));

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

app.get('/', (req, res) => { res.render('./index.ejs'); });
app.get('/auth/register', (req, res) => { res.render('./parts/registration.ejs'); });
app.get('/auth/login', (req, res) => { res.render('./login.ejs'); });
app.get('/about', (req, res) => { res.render('./about.ejs'); }); //о компании
app.get('/top-10-belkniga', (req, res) => { res.render('./top-10-belkniga.ejs'); });
app.get('/print', (req, res) => { res.render('./print.ejs'); });
app.get('/404', (req, res) => { res.render('./404.ejs'); });
app.get('/500', (req, res) => { res.render('./500.ejs'); });

app.post('/auth/login', UserController.login);
app.post('/auth/register', Validations.registerValidation, UserController.register);
app.get('/auth/me', checkAuth, async (req, res) =>  { //корзина
  try {
    let user = {};
    const data = await UserModel.findById(req.userId);
    user = data.toJSON;
    res.render('cart.ejs', { user: user});
  } catch (err) {
    console.error(err);
    res.render('./500.ejs');
  }
});

app.get('/tags', BookController.getLastTags);
app.get('/books', BookController.getAll);
app.get('/book-by-name', BookController.getBookByName);
app.get('/books/tags', BookController.getLastTags);
app.get('/books/:id', BookController.getOne);
app.post('/books', /*checkAuth, RoleController.isAdmin(['USER', 'ADMIN']), handleValidationErrors,*/ BookController.create);
app.delete('/books/:id', checkAuth, RoleController.isAdmin(['USER', 'ADMIN']), BookController.remove);
app.patch('/books/:id', checkAuth, Validations.bookCreateValidation, handleValidationErrors, BookController.update);

app.post('/pre-order', checkAuth, RoleController.isUser(['USER', 'ADMIN']), PreOrderController.createPreOrder, OrderController.isOrderCreated);
app.patch('/pre-order', checkAuth, RoleController.isUser(['USER', 'ADMIN']), PreOrderController.updatePreOrder);
app.post('/order', checkAuth, RoleController.isUser(['USER', 'ADMIN']), OrderController.createOrder);
app.patch('/order', checkAuth, RoleController.isUser(['USER', 'ADMIN']), OrderController.addToOrder);
app.delete('/order', checkAuth, RoleController.isUser(['USER', 'ADMIN']), OrderController.removeFromOrder);
app.patch('/order-status', checkAuth, RoleController.isUser(['USER', 'ADMIN']), OrderController.changeStatus);

app.get('/order/:id', OrderController.getOrderById);
app.post('/t-order', TOrderController.createTOrder);
app.post('/calculate-price', TOrderController.countCost);

app.post('/adminrolecheck', checkAuth, RoleController.isAdmin(['USER', 'ADMIN']), BookController.getAll);
app.post('/userrolecheck', checkAuth, RoleController.isUser(['USER', 'ADMIN']), BookController.getLastTags);

app.listen(5050, (err) =>{
    if (err) { return console.log(err);}
    console.log('Server is OK');
});