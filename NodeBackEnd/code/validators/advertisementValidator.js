const Joi = require('joi');

function validateAdvertisement(advertisement) {
    const imageItem = Joi.object().keys({
        tag: Joi.string(),
        value: Joi.string()
    });

    const schema = {
        name: Joi.string().min(5).max(100).required(),
        created_on: Joi.date().timestamp(),
        invalid_after: Joi.date().timestamp(),
        is_rented: Joi.boolean().required(),
        contact_number: Joi.string().min(11).max(14).required(),
        alternative_contact: Joi.string().min(11).max(14),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        address: Joi.string(),
        thana: Joi.string(),
        postCode: Joi.string(),
        zilla: Joi.string(),
        rent: Joi.number().integer().positive().required(),
        size: Joi.number().positive(),
        floor: Joi.number().integer().positive(),
        security_guards: Joi.boolean(),
        lift_escalator: Joi.boolean(),
        month_of_availability: Joi.string().required().valid('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
        rooms: Joi.object().keys({
            bedroom: Joi.number().integer(),
            bathroom: Joi.number().integer(),
            kitchen: Joi.number().integer(),
            drawing: Joi.number().integer(),
            living: Joi.number().integer(),
        }),
        images: Joi.array().items(imageItem)
    };

    return Joi.validate(advertisement, schema);
}

function validateSearchCriteria(criteria) {

    const schema = {
        center_lat: Joi.number(), 
        center_long: Joi.number(), 
        radius: Joi.number().integer(),
        rent: {
            value: Joi.number().integer(),
            priority: Joi.number().integer().min(1).max(5)
        },
        size: {
            value: Joi.number().integer(),
            priority: Joi.number().integer().min(1).max(5)
        },
        floor: {
            value: Joi.number().integer().min(0),
            priority: Joi.number().integer().min(1).max(5)
        },
        security_guards: {
            value: Joi.boolean(),
            priority: Joi.number().integer().min(1).max(5)
        },
        lift_escalator: {
            value: Joi.boolean(),
            priority: Joi.number().integer().min(1).max(5)
        },
        parking: {
            value: Joi.boolean(),
            priority: Joi.number().integer().min(1).max(5)
        },
        month_of_availability: {
            value: Joi.string().valid('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
            priority: Joi.number().integer().min(1).max(5)
        },
        rooms: {
            bedroom: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            },
            bathroom: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            },
            kitchen: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            },
            drawing: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            },
            living: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            }
        },
        nearby: {
            mosque: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            },
            hospital: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            },
            school: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            },
            park: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            },
            department_store: {
                value: Joi.number().integer(),
                priority: Joi.number().integer().min(1).max(5)
            }
        }
    };

    return Joi.validate(criteria, schema);
}

exports.validateAdvertisement = validateAdvertisement;
exports.validateSearchCriteria = validateSearchCriteria;