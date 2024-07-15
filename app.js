//Importing required modules and server related things
require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const connectDB = require('./sever/config/db');

//Creating an instance of express server
const app = express();

const PORT = 5000 || process.env.PORT;

//Connect to Database
connectDB();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}))


app.use(express.static('public'));

//Templating Engine
app.use(expressLayout);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');

app.use('/', require('./sever/routes/main.js')); 
app.use('/', require('./sever/routes/admin'));

app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`); 
}); 