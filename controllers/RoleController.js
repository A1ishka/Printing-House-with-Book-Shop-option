import UserModel from '../models/User.js';

export const isAdmin = function(roles){
    return async function(req, res, next){
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.render('./about.ejs');;
      }
      const { passwordHash, ...userData } = user._doc;

      let hasRole = false;

      if (user.role == roles[1]) hasRole = true;
      if (hasRole == false){ return res.render('./about.ejs');}
      next();
    } catch (err) {
      console.log(err);
      res.render('./errors/500.ejs');
    }
  }
};

export const isUser = function(roles){
    return async function(req, res, next){
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.render('./errors/403.ejs');
      }
      const { passwordHash, ...userData } = user._doc;

      let hasRole = false;      
      if (user.role == roles[0]) hasRole = true;
      if (hasRole == false){ return res.render('./errors/403.ejs');}
      next();

    } catch (err) {
      console.log(err);
      res.render('./errors/500.ejs');
    }
  }
};