const express = require('express');
const router = express.Router();

//call model
const User = require('../models/User');
const Authentication = require('../models/Authentication');

//middleware
const encrypt = require('../middleware/encrypt');
const auth = require('../middleware/auth');


// ==== START =====  call multer uplaod file
const multer = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')// local save file
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".png") //rename file
    }
})
const upload = multer({
    storage:storage
})
// ==== END =====  call multer uplaod file

// ===RefresgToken
router.post('/auth/refresh',auth.jwtVerifyRefeshToken,async (req,res)=>{
    User.findOne({Email:req.email}).then(user =>{                    
        Authentication.findOne({'UserID':user._id}).then(async authentication => { 
            const refresh = encrypt.check(req.token,authentication.Token); 
            if(refresh){
                console.log('hi');
                //create TOKEN
                const accessToken = auth.getGenerateAccessToken(user.Username, user.Email);
                const refreshToken = auth.getGenerateRefreshToken(user.Username, user.Email);
                const expiryrefreshToken = auth.getExpirDate(refreshToken);
                User.findOneAndUpdate({ 'User_id': user._id }, { 'Token': await encrypt.hash(refreshToken), 'ExpirationTime': expiryrefreshToken })
                    .then(() => {
                        res.status(200).json({ 'msg': 'Refresh success!', 'User Name': req.refreshTokenUsername, 'New Access_TOKEN': accessToken, 'New Refresh_TOKEN': refreshToken });
                    });
            }else{
                return res.status(401).json({status:"no",msg:"Wrong token"});
            }
        })
    })
})

router.post('/auth/login',(req,res)=>{
    const {Email,Password} = req.body;
    console.log(req.body)

    //check email
    User.findOne({Email:Email}).then( async result =>{
        //check password
        const login = await encrypt.check(Password,result.Password);
        if(login){
            //create TOKEN
            const accessToken = auth.getGenerateAccessToken(result.Username,Email,result.isAdmin);
            const refreshToken = auth.getGenerateRefreshToken(result.Username,Email,result.isAdmin);
            const expiryrefreshToken = auth.getExpirDate(refreshToken);

            //check if User already has token
            Authentication.findOne({'UserID':result._id})
                .then(async authentication =>{
                    if(authentication){
                        //update 
                        Authentication.findOneAndUpdate({'UserID':result._id},{ 'Token': await encrypt.hash(refreshToken), 'ExpirationTime': expiryrefreshToken })
                            .then(()=>{
                                res.status(200).json({ 'msg': 'Login and Refresh token success!','User Name':result.Username, 'Access_TOKEN': accessToken, 'Refresh_TOKEN': refreshToken });
                            })
                    }else{
                        //create new authencation
                        let newAuthentication = new Authentication({
                            UserID: result._id,
                            Token: await encrypt.hash(refreshToken),
                            ExpirationTime: expiryrefreshToken
                        });
                        //save authencation to database
                        newAuthentication.save().then(() => {
                            res.status(200).json({ 'msg': 'Login success!', 'User Name': result.Username, 'Access_TOKEN': accessToken, 'Refresh_TOKEN': refreshToken });
                        });
                    }
                })
        }else{
            res.status(400).json({ 'msg': 'Incorrect password',});
        }
    }).catch( (err)=>{
        console.log(err);
        res.status(400).json({ 'msg': 'Email not exits',})
    });
})

router.post('/auth/register',(req,res)=>{
    const {Username,Email,Password} = req.body;
    
    //check user
    User.findOne({$or:[{Username:Username},{Email:Email}]})
    .then(async user => {
        //user is exits
        if (user) {
            res.status(400).json({ 'msg': 'User exists!' })
        //user not exit
        } else {
            //hash all infomation User
            const encryptedPassword = await encrypt.hash(Password);

            //create New User
            let newUser = new User({
                Username: Username,
                Email: Email,
                Password: encryptedPassword,
                isAdmin:true
            })
            //save user to database
            newUser.save().then(result =>{
                res.status(400).json({ 'msg': 'Registed!, Please log in to use the Service','result':result});
            }).catch(err => console.log(err));
        }
    })
})

module.exports = router;