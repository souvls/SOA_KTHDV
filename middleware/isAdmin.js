class isAdmin{
    static checkAdmin = (req,res,next)=>{
        if(req.data.isAdmin){
            return next();
        }else{
            return res.status(401).json({status:"no",msg:"Not admin"});
        }

    }
}
module.exports = isAdmin