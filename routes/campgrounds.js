const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const User = require('../models/user');
const { isLoggedIn, isAuthor, validateCampgound } = require('../middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampgound, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampgound, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deletCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))




module.exports = router;