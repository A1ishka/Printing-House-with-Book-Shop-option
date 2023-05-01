import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decoded = jwt.verify(token, 'printingBooks');
      req.userId = decoded._id;
      next();
    } catch (verify_err) {
      return res.status(403).json({
        message: 'Для дальнейших действий необходимо войти в аккаунт',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Для дальнейших действий необходимо зарегистрироваться или войти в аккаунт',
    });
  }
};
