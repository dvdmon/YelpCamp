const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const User = require('../models/user');
const { isLoggedIn, isAuthor, validateCampgound } = require('../middleware');


router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// 'show' route
router.get('/:id', catchAsync(campgrounds.showCampground))


// Create route
router.post('/', isLoggedIn, validateCampgound, catchAsync(campgrounds.createCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateCampgound, catchAsync(campgrounds.editCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deletCampground))


module.exports = router;