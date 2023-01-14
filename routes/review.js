const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const { validateReview, isLoggedIn, isAuthor, isReviewAuthor } = require('../middleware');
const reviewController = require('../controllers/review');

router.post('/', isLoggedIn, validateReview, asyncErrorHandler(reviewController.addReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncErrorHandler(reviewController.deleteReview));

module.exports = router;