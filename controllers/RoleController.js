import UserModel from '../models/User.js';

export const isAdmin = function(roles){
    return async function(req, res, next){
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
      const { passwordHash, ...userData } = user._doc;

      let hasRole = false;

      if (user.role == roles[1]) hasRole = true;
      if (!hasRole){ return res.status(405).json({message:'Доступ не разрешен'})}
      next();

    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Нет доступа',
      });
    }
  }
};

export const isUser = function(roles){
    return async function(req, res, next){
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
      const { passwordHash, ...userData } = user._doc;

      let hasRole = false;      
      if (user.role == roles[0]) hasRole = true;
      if (!hasRole){ return res.status(405).json({message:'Доступ не разрешен'})}
      next();

    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Нет доступа',
      });
    }
  }
};