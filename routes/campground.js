const express = require('express');
const router = express.Router();
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const { campValidator, reviewValidator } = require('../utils/schemaValidator');
const CampGround = require('../models/campGround');
const CustomError = require('../utils/customError');

const validateCampData = (req, res, next) => {
    const { error } = campValidator.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw next(new CustomError(msg, 400));
    } else {
        next();
    }
}

router.get('/', asyncErrorHandler(async (req, res) => {
    const camps = await CampGround.find({});
    // console.log(camps);
    res.render('./camps/index', { camps });
}))

//remember to add names in input ejs template
router.post('/', validateCampData, asyncErrorHandler(async (req, res) => {
    const data = req.body;
    // console.log(`POST /camps ${data}`);
    const newCamp = new CampGround(req.body.camp);
    await newCamp.save();
    // console.log(newCamp);
    req.flash('success', 'Camp added successfully');
    res.redirect(`/camps/${newCamp._id}`);
    // res.send('Camp Data Validation Successful')
}))

router.get('/new', ((req, res) => {
    res.render('./camps/newCamp');
}))

router.get('/:id', asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id).populate('reviews');
    if (!camp) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/camps');
    }
    res.render('./camps/view', { camp });
}))

router.get('/:id/edit', asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/camps');
    }
    res.render('./camps/edit', { camp });
}))

router.patch('/:id', validateCampData, asyncErrorHandler(async (req, res, next) => {
    // console.log('/PATCH Request');
    // console.log(req);
    const { id } = req.params;
    const camp = await CampGround.findByIdAndUpdate(id, req.body.camp);
    if (!camp) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/camps');
    } else {
        req.flash('success', 'Camp updated successfully');
        res.redirect(`/camps/${camp._id}`);
    }
}))

router.delete('/:id', asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await CampGround.findByIdAndDelete(id);
    // console.log(deletedCamp);
    req.flash('success', 'Camp deleted successfully');
    res.redirect('/camps');
}))




module.exports = router;