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

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Connect DB
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL;
mongoose.set('strictQuery', false);

mongoose.connect(dbUrl, { useNewUrlParser: true, })
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

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/ddtvy9vcy/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

// setting view engine as EJS
app.set('view engine', 'ejs');
app.set('views'), path.join(__dirname, '/views');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: 'SecretKey',
    touchAfter: 24 * 60 * 60, //in secs
})

store.on('error', function (error) {
    next(new CustomError(error.message, 500));
})

const sessionConfig = {
    store,
    name: 'itachi',
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
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
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', user);
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