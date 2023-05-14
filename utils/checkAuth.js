import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";

export default (req,res,next)=>{
    const token = (req.cookies.jwtToken || '');
    
    if (token){
        try {
            req.userId = returnID(token);
        }catch (e){
            return res.redirect("../");
        }
        next();
    }else{
        return res.redirect("../");
    }
}

export const returnID = (token)=>{
    const cleartoken = (token || '').replace(/Bearer\s?/,'')
    const decoded = jwt.verify(cleartoken, 'printingBooks');
    return decoded._id;
}