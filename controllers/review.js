const CampGround = require('../models/campGround');
const Review = require('../models/reviewSchema');

module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const camp = await CampGround.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    // console.log(review);
    req.flash('success', 'Review added successfully');
    res.redirect(`/camps/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/camps/${id}`);
}