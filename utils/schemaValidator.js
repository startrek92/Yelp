const Joi = require('joi');
const campValidator = Joi.object({
    camp: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

module.exports.campValidator = campValidator;


const reviewValidator = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required()
    }).required()
})

module.exports.reviewValidator = reviewValidator;