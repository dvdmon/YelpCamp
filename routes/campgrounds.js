const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const User = require('../models/user');
const { isLoggedIn, isAuthor, validateCampgound } = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

// 'show' route
router.get('/:id', catchAsync(async (req, res) => {
    // create a campground object that 'populates' (fills out) the associated review objects
    // and author objects so they can be referenced in the view
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });

}))


// Create route
router.post('/', isLoggedIn, validateCampgound, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampgound, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}))


module.exports = router;