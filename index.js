import express from 'express';
import mongoose from 'mongoose';
import * as Validations from './validations/auth.js';

import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import * as UserController from './controllers/UserController.js';
import * as BookController from './controllers/BookController.js';
import * as RoleController from './controllers/RoleController.js';
import * as PreOrderController from './controllers/PreOrderController.js';
import * as OrderController from './controllers/OrderController.js';
import * as TOrderController from './controllers/TOrderController.js';
import cookieParser from 'cookie-parser';
import Book from './models/Book.js';

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
app.get('/auth/login', (req, res) => { res.render('./parts/login.ejs'); });
app.get('/about', checkAuth, RoleController.isAdmin(['USER', 'ADMIN']), (req, res) => { res.render('./admin_index.ejs'); }); //о компании
app.get('/top-10-belkniga', (req, res) => { res.render('./top-10-belkniga.ejs'); });
app.get('/print', checkAuth, RoleController.isUser(['USER', 'ADMIN']), (req, res) => { res.render('./print.ejs'); });

app.get('/403', (req, res) => { res.render('./errors/403.ejs'); });
app.get('/404', (req, res) => { res.render('./errors/404.ejs'); });
app.get('/500', (req, res) => { res.render('./errors/500.ejs'); });

app.get('/create-book', checkAuth, /*RoleController.isAdmin(['USER', 'ADMIN']),*/ (req, res) => { res.render('./book_creation.ejs'); });
app.get('/admin', checkAuth, (req, res) => { res.render('./admin_index.ejs'); });

app.post('/auth/login', UserController.login);
app.post('/auth/register', Validations.registerValidation, UserController.register);
app.get('/auth/me', checkAuth, RoleController.isUser(['USER', 'ADMIN']), OrderController.showOrder);
app.get('/cart-history', checkAuth, RoleController.isUser(['USER', 'ADMIN']), OrderController.showSavedOrder);
app.post('/auth/me/:orderId/update', PreOrderController.updatePreOrder);
app.post('/auth/me/:orderId/update/status', OrderController.changeStatus);
app.post('/auth/me/:orderId/update/status/delete', OrderController.changeStatusToDelete);
app.post('/auth/me/:orderId/update/adress', OrderController.changeAdress);
app.post('/auth/me/:orderId/delete', OrderController.removeFromOrder);

app.get('/tags', BookController.getLastTags);
app.get('/books', BookController.getAll);
app.get('/admin-books', BookController.getAllToAdmin);
app.get('/books/tags', BookController.getLastTags);
app.get('/books/:id', BookController.getOne);
app.get('/admin-books/:id', BookController.getOneToAdmin);
app.post('/admin-books/:id', BookController.editParams);

app.get('/printing-house', TOrderController.getPrintToAdmin);
app.get('/payment', (req, res) => { res.render('./payment.ejs'); });
app.post('/auth/me/paid', OrderController.changeStatusToPaid);

app.post('/create-book', checkAuth, RoleController.isAdmin(['USER', 'ADMIN']), Validations.bookCreateValidation, BookController.create);
app.delete('/admin-books/:id', checkAuth, RoleController.isAdmin(['USER', 'ADMIN']), BookController.remove);
app.patch('/books/:id', checkAuth, Validations.bookCreateValidation, handleValidationErrors, BookController.update);

app.post('/auth/me', checkAuth, RoleController.isUser(['USER', 'ADMIN']), OrderController.preOrderCr);
app.patch('/auth/me', checkAuth, RoleController.isUser(['USER', 'ADMIN']), PreOrderController.updatePreOrder);

app.get('/users', UserController.getUsers);
app.delete('/users', checkAuth, RoleController.isAdmin(['USER', 'ADMIN']), UserController.remove);

app.delete('/order', checkAuth, RoleController.isUser(['USER', 'ADMIN']), OrderController.removeFromOrder);
app.patch('/order-status', checkAuth, RoleController.isUser(['USER', 'ADMIN']), OrderController.changeStatus);

app.get('/order/:id', OrderController.getOrderById);
app.post('/t-order', TOrderController.createTOrder);
app.post('/calculate-price', TOrderController.countCost);

app.post('/adminrolecheck', checkAuth, RoleController.isAdmin(['USER', 'ADMIN']), BookController.getAll);
app.post('/userrolecheck', checkAuth, RoleController.isUser(['USER', 'ADMIN']), BookController.getLastTags);

app.get('/search', (req, res) => {
  const searchQuery = req.query.q;
  const minPrice = parseInt(req.query.minPrice);
  const maxPrice = parseInt(req.query.maxPrice);

  let filter = {};
  filter = {
    $or: [
      //{ description: { $regex: searchQuery, $options: 'i' } },
      { name: { $regex: searchQuery, $options: 'i' } },
      { author: { $regex: searchQuery, $options: 'i' } }
    ],
    price: { $gte: minPrice, $lte: maxPrice }
  };

Book.find(filter)
  .then(results => {
    res.render('search', { results });
  })
  .catch(err => {
    console.error('Ошибка при выполнении поискового запроса:', err);
    res.render('./errors/500.ejs');
  });
});



app.listen(5050, (err) =>{
    if (err) { return console.log(err);}
    console.log('Server is OK');
});