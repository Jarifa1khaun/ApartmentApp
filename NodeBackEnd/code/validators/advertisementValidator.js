const Joi = require('joi');

function validateAdvertisement(advertisement) {
    const schema = {
        name: Joi.string().min(5).max(100).required(),
        created_on: Joi.date().timestamp(),
        user: Joi.string().required()
        // invalid_after: Joi.date().timestamp(),
        // is_rented: Joi.boolean().required(),
        // contact_number: Joi.string().min(11).max(14).required(),
        // alternative_contact: Joi.string().min(11).max(14),
        // lat: Joi.number().required(),
        // long: Joi.number().required(),
        // address: Joi.string(),
        // thana: Joi.string(),
        // postCode: Joi.string(),
        // zilla: Joi.string(),
        // rent: Joi.number().integer().positive(),
        // size: Joi.number().positive(),
        // floor: Joi.number().integer().positive(),
        // security_guards: Joi.boolean(),
        // lift_escalator: Joi.boolean(),
        // month_of_availability: Joi.string()
    };

    return Joi.validate(advertisement, schema);
}

exports.validateAdvertisement = validateAdvertisement;