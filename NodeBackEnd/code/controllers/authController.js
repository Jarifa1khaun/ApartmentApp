const bcrypt = require('bcrypt');

const User = require('../models/user');
const authValidator = require('../validators/authValidator');

async function login(req, res) {

    const { error } = authValidator.validateRequest(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    });

    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).send('successfully logged in.');
}

exports.login = login;