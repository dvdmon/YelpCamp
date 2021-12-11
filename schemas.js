const { object } = require('joi');
const Joi = require('joi');

// Validation for campground objects
module.exports.campgroundJoiSchema = campgroundJoiSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

// Validation for review objects
module.exports.reviewJoiSchema = reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

// Joi is a module that allows us to validate requests (form submissions, etc.) based
// on the above 'schemas' which we then call the 'validate()' functon on in our routes where
// we parse these requests.