const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const { campValidator, reviewValidator } = require('../utils/schemaValidator');
const CampGround = require('../models/campGround');
const Review = require('../models/reviewSchema');
const CustomError = require('../utils/customError');

const validateReview = (req, res, next) => {
    const { error } = reviewValidator.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw next(new CustomError(msg, 400));
    } else {
        next();
    }
}

router.post('/', validateReview, asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const camp = await CampGround.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    // console.log(review);
    req.flash('success', 'Review added successfully');
    res.redirect(`/camps/${id}`);
}))

router.delete('/:reviewId', asyncErrorHandler(async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/camps/${id}`);
}))

module.exports = router;