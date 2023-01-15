if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const methodOverride = require('method-override')
const User = require('./models/user');
const ejsMate = require('ejs-mate');
const CustomError = require('./utils/customError');

var favicon = require('serve-favicon')

const campground = require('./routes/campground');
const review = require('./routes/review');
const user = require('./routes/user');

const session = require('express-session');
const flash = require('express-flash');

const localStrategy = require('passport-local');
const passport = require('passport');


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
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// authenticate static method added by plugin
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// allow forms to send PUT DELETE HTTP Request
app.use(methodOverride('_method'));

app.use((req, res, next) => {

    // implement return To
    // req.session.returnTo = req.originalUrl;
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', user);
app.use('/camps', campground);
app.use('/camps/:id/reviews', review);

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


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