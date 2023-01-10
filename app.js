const express = require('express');
const path = require('path');
const methodOverride = require('method-override')
const CampGround = require('./models/campGround');
const ejsMate = require('ejs-mate');
const { campValidator, reviewValidator } = require('./utils/schemaValidator');
const CustomError = require('./utils/customError');
const asyncErrorHandler = require('./utils/asyncErrorHandler');
const Review = require('./models/reviewSchema');

// Connect DB
const mongoose = require('mongoose');
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



// allow forms to send PUT DELETE HTTP Request
app.use(methodOverride('_method'));

const validateCampData = (req, res, next) => {
    const { error } = campValidator.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw next(new CustomError(msg, 400));
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewValidator.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw next(new CustomError(msg, 400));
    } else {
        next();
    }
}


app.get('/', ((req, res) => {
    res.render('./home');
}))

app.get('/camps', asyncErrorHandler(async (req, res) => {
    const camps = await CampGround.find({});
    // console.log(camps);
    res.render('./camps/index', { camps });
}))

//remember to add names in input ejs template
app.post('/camps', validateCampData, asyncErrorHandler(async (req, res) => {
    const data = req.body;
    // console.log(`POST /camps ${data}`);
    const newCamp = new CampGround(req.body.camp);
    await newCamp.save();
    // console.log(newCamp);
    res.redirect(`/camps/${newCamp._id}`);
    // res.send('Camp Data Validation Successful')
}))

app.get('/camps/new', ((req, res) => {
    res.render('./camps/newCamp');
}))

app.get('/camps/:id/edit', asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id);
    console.log(camp);
    res.render('./camps/edit', { camp });
}))

app.get('/camps/:id', asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id).populate('reviews');
    // console.log(camp);
    res.render('./camps/view', { camp });
}))

app.patch('/camps/:id', validateCampData, asyncErrorHandler(async (req, res, next) => {
    // console.log('/PATCH Request');
    // console.log(req);
    const { id } = req.params;
    const camp = await CampGround.findByIdAndUpdate(id, req.body.camp);
    if (!camp) {
        next(new CustomError(`Camp Not Found. ID - ${id}`, 400));
    } else {
        res.redirect(`/camps/${camp._id}`);
    }
}))

app.delete('/camps/:id', asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await CampGround.findByIdAndDelete(id);
    // console.log(deletedCamp);
    res.redirect('/camps');
}))

app.post('/camps/:id/reviews', validateReview, asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    // console.log(review);
    res.redirect(`/camps/${id}`);
}))

app.delete('/camps/:id/reviews/:reviewId', asyncErrorHandler(async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/camps/${id}`);
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