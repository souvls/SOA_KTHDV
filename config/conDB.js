const mongoose = require('mongoose');

//connect mongoDB
const connect = mongoose.connect(process.env.MONGODB_URI,{
    serverSelectionTimeoutMS: 5000,
}).then(()=> console.log('Mongo connected!'))
.catch(err =>{ console.log(err)});

module.exports = connect;