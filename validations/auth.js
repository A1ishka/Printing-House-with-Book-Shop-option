import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  body('fullName', 'Укажите имя').isLength({ min: 3 }),
  body('role', 'Неверный формат').optional().isString(),
];

export const bookCreateValidation = [
  body('name', 'Введите название книги').isLength({ min: 3 }).isString(),
  body('description', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('pageCount', 'Число страниц не может быть меньше нуля').isNumeric(),
  body('price', 'Цена не может быть меньше нуля').isNumeric(),
  body('author', 'Введите автора книги').isLength({ min: 3 }).isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

