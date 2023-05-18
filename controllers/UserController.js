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

    const jwtToken = jwt.sign(
      {
        _id: user._id,
      },
      'printingBooks',
      {
        expiresIn: '30d',
      },
    );

    const options = {
      maxAge: 7 * 24 * 60 * 60 * 1000, // срок действия токена - 7 дней
      httpOnly: true, // cookie-файл доступен только для сервера
      sameSite: 'strict', // cookie-файл отправляется только на сайт, откуда он был установлен
      secure: true // cookie-файл отправляется только через HTTPS соединение
    };
    res.cookie('jwtToken', jwtToken, options);
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, jwtToken, });
    //res.render('./index.ejs');

  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }); //аналогичная ситуация с регистрацией, но здесь не считывает
    console.log(req.body.email, user);
    if (!user) {
      return res.render('./errors/404.ejs');
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const jwtToken = jwt.sign(
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
      jwtToken,
    });
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.render('./errors/404.ejs');
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

/*exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: "Déconnexion réussie !" })
}*/