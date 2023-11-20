const express =require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const router_user = require('./router/router_user');
const router_product = require('./router/router_product');
const auth = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin')
//use file .env
dotenv.config();

//connect DB
const connect = require('./config/conDB');
const User = require('./models/User');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json({limit:'10mb'}));

// ====> Router
app.get('/',auth.jwtValidate,(req,res)=>{
    res.status(200).json({'msg':'Hello Welcome To My Service.','data':req.data});
});

app.use(router_user)
app.use("/product",auth.jwtValidate,isAdmin.checkAdmin,router_product)

// ====> Run server
app.listen(process.env.PORT,()=>{
    console.log('start server');
})