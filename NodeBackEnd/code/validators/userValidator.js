const Joi = require('joi');

function validateUser(user) {
    const schema = {
        _id: Joi.string().alphanum(),
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
    };

    return Joi.validate(user, schema);
}

function validateUserWithoutRequired(user) {

    const schema = {
        _id: Joi.string().alphanum(),
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email(),
        password: Joi.string().min(5).max(255),
        isAdmin: Joi.boolean()
    };

    return Joi.validate(user, schema);
}

exports.validateUser = validateUser;
exports.validateUserWithoutRequired = validateUserWithoutRequired;