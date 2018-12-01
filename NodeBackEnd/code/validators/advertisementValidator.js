const Joi = require('joi');

const validPriorities = ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST'];
const validMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
        sublet: Joi.boolean().required(),
        contact_number: Joi.string().min(11).max(14).required(),
        alternative_contact: Joi.string().min(11).max(14),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        address: Joi.string(),
        thana: Joi.string(),
        postCode: Joi.string(),
        zilla: Joi.string(),
        rent: Joi.number().integer().positive().required(),
        size: Joi.number().positive().required(),
        floor: Joi.number().integer().positive().required(),
        security_guards: Joi.boolean().required(),
        lift_escalator: Joi.boolean().required(),
        parking: Joi.boolean().required(),
        month_of_availability: Joi.string().required().valid(validMonths),
        rooms: Joi.object().required().keys({
            bedroom: Joi.number().integer().required(),
            bathroom: Joi.number().integer().required(),
            kitchen: Joi.number().integer().required(),
            drawing: Joi.number().integer().required(),
            living: Joi.number().integer().required(),
        }),
        images: Joi.array().items(imageItem)
    };

    return Joi.validate(advertisement, schema);
}

function validateAdvertisementWithoutRequired(advertisement) {

    const imageItem = Joi.object().keys({
        tag: Joi.string(),
        value: Joi.string()
    });

    const schema = {
        _id: Joi.string().required(),
        name: Joi.string().min(5).max(100),
        created_on: Joi.date().timestamp(),
        invalid_after: Joi.date().timestamp(),
        is_rented: Joi.boolean(),
        sublet: Joi.boolean(),
        contact_number: Joi.string().max(14),
        alternative_contact: Joi.string().max(14),
        lat: Joi.number(),
        long: Joi.number(),
        address: Joi.string(),
        thana: Joi.string(),
        postCode: Joi.string(),
        zilla: Joi.string(),
        rent: Joi.number().integer().positive(),
        size: Joi.number().positive(),
        floor: Joi.number().integer().positive(),
        security_guards: Joi.boolean(),
        lift_escalator: Joi.boolean(),
        parking: Joi.boolean(),
        month_of_availability: Joi.string().valid(validMonths),
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
        center_lat: Joi.number().required(), 
        center_long: Joi.number().required(), 
        radius: Joi.number().integer().required(),
        sublet: Joi.boolean().required(),        
        rent: {
            value: Joi.number().integer().required(),
            priority: Joi.string().valid(validPriorities).required()
        },
        size: {
            value: Joi.number().integer().required(),
            priority: Joi.string().valid(validPriorities).required()
        },
        floor: {
            value: Joi.number().integer().min(0).required(),
            priority: Joi.string().valid(validPriorities).required()
        },
        security_guards: {
            value: Joi.boolean().required(),
            priority: Joi.string().valid(validPriorities).required()
        },
        lift_escalator: {
            value: Joi.boolean().required(),
            priority: Joi.string().valid(validPriorities).required()
        },        
        parking: {
            value: Joi.boolean().required(),
            priority: Joi.string().valid(validPriorities).required()
        },
        month_of_availability: {
            value: Joi.string().valid(validMonths).required(),
            priority: Joi.string().valid(validPriorities).required()
        },
        rooms: {
            bedroom: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            },
            bathroom: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            },
            kitchen: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            },
            drawing: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            },
            living: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            }
        },
        nearby: {
            mosque: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            },
            hospital: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            },
            school: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            },
            park: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            },
            department_store: {
                value: Joi.number().integer().required(),
                priority: Joi.string().valid(validPriorities).required()
            }
        }
    };

    return Joi.validate(criteria, schema);
}

exports.validateAdvertisement = validateAdvertisement;
exports.validateSearchCriteria = validateSearchCriteria;
exports.validateAdvertisementWithoutRequired = validateAdvertisementWithoutRequired; 