const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const asyncErrorhandler = require('../utils/asyncErrorHandler');
const passport = require('passport');
const CustomError = require('../utils/customError');
const userController = require('../controllers/user');


router.get('/register', userController.registerForm);

router.post('/register', asyncErrorhandler(userController.addUser));

router.get('/login', userController.loginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), asyncErrorhandler(userController.loginUser))

router.get('/logout', userController.logoutUser);

module.exports = router;