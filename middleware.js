const CampGround = require('./models/campGround');
const Review = require('./models/reviewSchema');
const { campValidator, reviewValidator } = require('./utils/schemaValidator');
const CustomError = require('./utils/customError');
const asyncErrorHandler = require('./utils/asyncErrorHandler');
const { storage } = require('./cloudinary');
const multer = require('multer');
const uploads = multer({ storage });

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must me signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'Not Authorized');
        return res.redirect(`/camps/${id}`);
    }
    next();
})

module.exports.isReviewAuthor = asyncErrorHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Not Authorized');
        return res.redirect(`/camps/${id}`);
    }
    next();
})

module.exports.validateCampData = (req, res, next) => {
    const { error } = campValidator.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw next(new CustomError(msg, 400));
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewValidator.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw next(new CustomError(msg, 400));
    } else {
        next();
    }
}

module.exports.uploadUtil = async (req, res, next) => {
    const uploadResult = await uploads.array('image');
    console.log('uploading images')
    console.log(req);
    const imgArray = req.files.map(fl => ({ url: fl.path, name: fl.name }));
    req.body.camp.image = imgArray;
    console.log(req.body);
    next();
}