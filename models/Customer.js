const mongoose = require('mongoose')

//design schema
let customerSchema = mongoose.Schema({
    CustomerID:Number,
    UserID:Number,
    FirstName:String,
    LastName:String,
    Email:String,
    Phone:String,
    DateOfBirth:Date,
    Gender: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác']
    },
    RegistrationDate: Date,
    LastLogin: Date,
    ProfilePicture: String
});

//create model
let Customer = mongoose.model("Customers",customerSchema);

module.exports = Customer;