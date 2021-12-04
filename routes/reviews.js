const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const Review = require('../models/review');;
const Campground = require('../models/campground');


const { reviewJoiSchema } = require('../schemas.js');


// middleware that runs as part of the route handler to catch validaton errors from Joi
const validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const review = new Review(req.body.review);
    const campground = await Campground.findById(id);
    campground.reviews.push(review._id);

    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!')
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    //await Campground.findByIdAndDelete(id).

    res.redirect(`/campgrounds/${id}`)


}))

module.exports = router;