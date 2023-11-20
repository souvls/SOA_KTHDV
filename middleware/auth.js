const jwt = require('jsonwebtoken');



class auth{

    //method create token
    static getGenerateAccessToken(username,email,isAdmin){
        return jwt.sign({"username":username,"email":email,"isAdmin":isAdmin},process.env.ACCESS_TOKEN_KEY,{expiresIn:"3m",algorithm:"HS256" })
    }
    static getGenerateRefreshToken(username,email,isAdmin){
        return jwt.sign({"username":username,"email":email,"isAdmin":isAdmin},process.env.REFRESH_TOKEN_KEY,{expiresIn:"1d",algorithm:"HS256" })
    }
    static getExpirDate(token){
        const decodedToken = jwt.decode(token, { complete: true });
        const expiryDate = new Date(decodedToken.payload.exp * 1000);
        return expiryDate;
    }
    static jwtValidate = (req,res,next)=>{
        const tokenHeader =  req.headers.authorization
        //Check the header contains the token or not.
        if(tokenHeader){
            try{
                //convert token to object and save to req.user
                const token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
                req.data = decoded;
                return next();
            }catch(err){
                return res.status(401).json({status:"no",msg:"Invalid token"});
            }
        }else{
            return res.status(401).json({status:"no",msg:"A token is required for authentication"});
        }
    }
    static jwtVerifyRefeshToken = (req,res,next)=>{
        const tokenHeader =  req.headers.authorization

        //Check the header contains the token or not.
        if(tokenHeader){
            try{
                const token = req.headers.authorization.split(" ")[1];

                jwt.verify(token,process.env.REFRESH_TOKEN_KEY,(err,decoded)=>{
                    if(err) return res.status(401).json({status:"no",msg:"Wrong token"});
                    req.token = token;
                    req.email = decoded.email;
                    return next();
                })
                
            }catch(err){
                return res.status(401).json({status:"no",msg:"Invalid token"});
            }
        }else{
            return res.status(401).json({status:"no",msg:"A token is required for authentication"});
        }
    }
    // static jwtValidate = (req, res, next) => {
    //     try {
    //         if (!req.headers["authorization"]) return res.sendStatus(401)
    //         const token = req.headers["authorization"].replace("Bearer ", "")

    //         jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
    //             if (err) throw new Error(error)
    //         })
    //         next()
    //     } catch (err) {
    //         if (err) throw new Error(err)
    //     }
    // }
}
module.exports = auth;