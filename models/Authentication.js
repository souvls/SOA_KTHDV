const mongoose = require('mongoose')

//design schema
let authenticationSchema = mongoose.Schema({
    AuthenticationID:Number,
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    Token:String,
    ExpirationTime:Date
});

//create model
let Authentication = mongoose.model("Authentications",authenticationSchema);

module.exports = Authentication;