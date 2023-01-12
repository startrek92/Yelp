const express = require('express');
const path = require('path');
const methodOverride = require('method-override')
const CampGround = require('./models/campGround');
const ejsMate = require('ejs-mate');
const { campValidator, reviewValidator } = require('./utils/schemaValidator');
const CustomError = require('./utils/customError');
const asyncErrorHandler = require('./utils/asyncErrorHandler');

const campground = require('./routes/campground');
const review = require('./routes/review');

const session = require('express-session');
const flash = require('express-flash');

// Connect DB
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, })
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.log("Error");
        console.log(err);
    });
// DB Connect

const app = express();

// set ejsMate as ejs engine
app.engine('ejs', ejsMate);

// allow express routes to parse data from form and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setting view engine as EJS
app.set('view engine', 'ejs');
app.set('views'), path.join(__dirname, '/views')

const sessionConfig = {
    secret : "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly : true,
     }
}

app.use(session(sessionConfig));
app.use(flash());



// allow forms to send PUT DELETE HTTP Request
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/camps', campground);
app.use('/camps/:id/reviews', review);

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', ((req, res) => {
    res.render('./home');
}))

app.all('*', (req, res, next) => {
    next(new CustomError("Page Not Found", 500));
})

app.use((err, req, res, next) => {
    console.log('in error');
    console.log(err);
    const { message = 'Page Not Found', statusCode = 500 } = err;
    res.status(statusCode).render('./error', { err });
})

app.listen(3000, () => {
    console.log('App Started on Port 3000');
})