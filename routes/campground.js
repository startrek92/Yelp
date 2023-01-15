const express = require('express');
const router = express.Router();
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const { isLoggedIn, uploadUtil } = require('../middleware');
const { isAuthor, validateCampData } = require('../middleware');
const campController = require('../controllers/camp');
const { storage } = require('../cloudinary');
const multer = require('multer');
const uploads = multer({ storage });


router.route('/')
    .get(asyncErrorHandler(campController.viewAllCamps))
    .post(isLoggedIn, uploads.array('image'), validateCampData, asyncErrorHandler(campController.addNewCamp));

router.get('/new', isLoggedIn, (campController.newCampForm));
// router.get('/new', (campController.newCampForm));

router.route('/:id')
    .get(asyncErrorHandler(campController.viewCamp))
    .patch(isLoggedIn, isAuthor, uploads.array('image'), validateCampData, asyncErrorHandler(campController.updateCamp))
    .delete(isLoggedIn, isAuthor, asyncErrorHandler(campController.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, asyncErrorHandler(campController.updateCampForm));


module.exports = router;