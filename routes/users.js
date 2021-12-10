const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users')


router.get('/register', users.renderRegistrationForm);

router.post('/register', catchAsync(users.userRegister));

router.get('/login', users.renderLoginForm)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.userLogin);

router.get('/logout', users.userLogout)

module.exports = router;