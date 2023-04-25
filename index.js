import express from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { registerValidation } from './validations/auth.js';

import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';


import * as UserController from './controllers/UserController.js'
import * as BookController from './controllers/BookController.js'

mongoose
.connect('mongodb+srv://alika:qv8GdxBfWhxHT5YE@cluster0.kpu7dbl.mongodb.net/book?retryWrites=true&w=majority')
.then(()=> console.log('DB is OK'))
.catch((err)=> console.log('DB error', err));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/me', checkAuth, UserController.getMe);

app.get('/tags', BookController.getLastTags);

app.get('/books', BookController.getAll);
app.get('/books/tags', BookController.getLastTags);
app.get('/books/:id', BookController.getOne);
app.post('/books', /*checkAuth,*/ handleValidationErrors, BookController.create);
app.delete('/books/:id', /*checkAuth,*/ BookController.remove);
/*app.post("/deletebooks/:id" , async ( req , res ) =>{ //не работает совершенно!!! переделать логику выполнения
    try{
        await BookModel.findOneAndRemove({
        _id: req.params.id  
        })
    .then(doc => {
        res.json(doc); 
     });

    } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить книги',
    });
  }
});*/
/*app.patch(
  '/books/:id',
  checkAuth,
  bookCreateValidation,
  handleValidationErrors,
  BookController.update,
);*/

app.listen(5050, (err) =>{
    if (err){
        return console.log(err);
    }
    console.log('Server OK');
});