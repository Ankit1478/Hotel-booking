
const joi = require("joi");

module.exports.lisdtingscheme = joi.object({

    listing : joi.object({
        title : joi.string().required(),
        description: joi.string().required(),
        price: joi.string().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
    }).required()
})

module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating:joi.number().required(),
        comment:joi.string().required()
    }).required()
})