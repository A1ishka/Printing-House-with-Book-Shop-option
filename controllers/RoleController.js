import jwt from 'jsonwebtoken';

export const rolemode = function(roles){
    return function(req, res, next){
        if (req.method ==="OPTIONS"){
            next();
        }

        try{
            const token = req.header.authorization.split(' ')[1];
            if (!token){
                return res.status(403).json(
                    {
                        message: "Пользователь не авторизован",
                    }
                )
            }
            const decodeData = jew.verify(token, 'printingBooks');
            req.user = decodeData;
            next();
        }catch (error){
            console.log(err);
        }
    }
}