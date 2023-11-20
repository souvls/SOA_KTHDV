const mongoose = require('mongoose')

//design schema
let userSchema = mongoose.Schema({
    UserID:Number,
    Username:String,
    Email:String,
    Password:String,
    isAdmin:Boolean
});

//create model
let User = mongoose.model("Users",userSchema);

module.exports = User;