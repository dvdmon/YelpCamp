const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Review = require('../models/review');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const campground = await Campground.findById(id);
    campground.reviews.push(review._id);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!')
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    //await Campground.findByIdAndDelete(id).

    res.redirect(`/campgrounds/${id}`)


}))

module.exports = router;