const express = require('express');
const router = express.Router();
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const { campValidator, reviewValidator } = require('../utils/schemaValidator');
const CampGround = require('../models/campGround');
const CustomError = require('../utils/customError');
const { isLoggedIn } = require('../middleware');
const { isAuthor, validateCampData } = require('../middleware');

const campController = require('../controllers/camp');

router.route('/')
    .get(asyncErrorHandler(campController.viewAllCamps))
    .post(isLoggedIn, validateCampData, asyncErrorHandler(campController.addNewCamp));

router.get('/new', isLoggedIn, (campController.newCampForm));

router.route('/:id')
    .get(asyncErrorHandler(campController.viewCamp))
    .patch(isLoggedIn, isAuthor, validateCampData, asyncErrorHandler(campController.updateCamp))
    .delete(isLoggedIn, isAuthor, asyncErrorHandler(campController.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, asyncErrorHandler(campController.updateCampForm));


module.exports = router;