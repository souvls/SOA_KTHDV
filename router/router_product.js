const express = require('express');
const router = express.Router();


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
router.get('/all',(req,res)=>{
    console.log("all proeducts");
})
module.exports = router;