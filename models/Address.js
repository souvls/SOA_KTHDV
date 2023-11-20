const mongoose = require('mongoose')

//design schema
let addressSchema = mongoose.Schema({
    AddressID:Number,
    CustomerID:Number,
    StreetAddress:String,
    City:String,
    State:String,
    ZipCode:String,
    Country:String,
    Default:Boolean
});

//create model
let Address = mongoose.model("Address",addressSchema);

module.exports = Address;