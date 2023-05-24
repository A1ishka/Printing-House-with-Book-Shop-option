import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
      { _id: user._id, },
      'printingBooks',
      { expiresIn: '30d', },
    );

    const options = {
      maxAge: 7 * 24 * 60 * 60 * 1000, // срок действия - 7 дней
      httpOnly: true, // cookie-файл доступен только для сервера
      sameSite: 'strict', // cookie-файл отправляется только на сайт, откуда он был установлен
      secure: true // cookie-файл отправляется только через HTTPS соединение
    };
    res.cookie('jwtToken', jwtToken, options);
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, jwtToken, });
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
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
      { _id: user._id, },
      'printingBooks',
      { expiresIn: '30d', },
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
    if (!user) {  return res.render('./errors/404.ejs'); }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.render('./errors/errors/500.ejs');
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: 'USER' }).exec(); 
    res.render('users-to-admin', { users });
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const remove = async (req, res) => {
  try {
    var userData = req.body.userId;
    const deletingUser = await UserModel.findByIdAndDelete(userData._id);
    console.log(req.body.userId, deletingUser);
    if (!deletingUser) { return res.render('./errors/404.ejs');}
    res.json({message: 'Успешно'})
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};