const _ = require('lodash');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const userValidator = require('../validators/userValidator');

async function profileInfo(req, res) {
    try {
        const user = await User.findById(req.user._id).select('-password');
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}

async function createUser(req, res) {
    console.log(req);
    const {
        error
    } = userValidator.validateUser(req.body);

    if (error) return res.status(400).send({
        message: error.details[0].message
    });

    let user = await User.findOne({
        email: req.body.email
    });

    if (user) return res.status(400).send({
        message: 'User already registered.'
    });

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        await user.save();
    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }

    const token = user.generateAuthToken();
    return res.status(200).header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
};

async function updateUser(req, res) {

    if (req.user.isAdmin === true || req.user._id === req.body._id) {
        const {
            error
        } = userValidator.validateUserWithoutRequired(req.body);

        if (error) return res.status(400).send({
            message: error.details[0].message
        });

        let user = await User.findOne({
            _id: req.body._id
        });

        if (!user) return res.status(404).send({
            message: 'No user found for this id.'
        });

        user = _.pick(req.body, ['name', 'email', 'isAdmin']);
        console.log(req.body.password);
        if (req.body.password !== undefined && typeof req.body.password === 'string' && req.body.password.length !== 0) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }

        User.findOneAndUpdate({
            _id: req.body._id
        }, user, {
            upsert: false
        }, function (err, user) {
            if (err) return res.status(500).send({
                message: err
            });
            return res.status(200).send({
                message: "successfully updated"
            });
        });
    } else {
        res.status(403).send({
            message: 'You do not have necessary permission to perform this operation.'
        });
    }

};

async function deleteSingleUser(req, res) {
    try {

        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).send({
            message: "user not found"
        });

        user.remove()
            .then(function (user) {

                return res.status(200).send({
                    message: 'user deletion successful.'
                });

            }).catch(function (err) {
                if (err) return res.status(500).send({
                    message: error.details[0].message
                });
            })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "something wrong happened"
        });
    }
}

async function getAllUser(req, res) {

    let query = {}
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);

    if (isNaN(pageNumber) || pageNumber < 0 || pageNumber === 0) {
        return res.status(400).json({
            message: "invalid page number, should start from 1."
        });
    }

    if (isNaN(pageSize) || pageSize < 0 || pageSize === 0) {
        return res.status(400).json({
            message: "invalid page size, should be greater than 0."
        });
    }

    query.limit = pageSize;
    query.skip = pageSize * (pageNumber - 1);

    let count = 0;

    try {
        await User.count({})
            .then(function (cnt) {
                count = cnt;
            })
            .catch(function (err) {
                res.status(500).send({
                    message: err
                });
            });

        User.find({}, {}, query)
            .then(function (users) {
                const userList = _.map(users, _.partialRight(_.pick, ['_id', 'name', 'email', 'isAdmin']));
                let response = {
                    userList: userList,
                    totalCount: count
                };
                res.status(200).send(response);
            }).catch(function (err) {
                if (error) return res.status(500).send({
                    message: error.details[0].message
                });
            });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "something wrong happened."
        });
    }
}

async function findUserById(req, res) {

    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).send({
            message: "user not found"
        });

        return res.status(200).send(_.pick(user, ['name', 'email', 'isAdmin']));
    } catch (error) {
        return res.status(500).send({
            message: "Database operation failed"
        });
    }
}

async function createFirstAdmin() {

    const firstAdminName = 'Admin User 1';
    const firstAdminEmail = 'admin@test.com';
    const firstAdminPassword = '123456789';

    let count = 0;

    await User.count({
        isAdmin: true
    }).then(function (cnt) {
        count = cnt;
    }).catch(function (err) {
        console.log('error ocurred during first admin creation count check' + err);
    });

    if (count === 0) {

        let user = new User();
        user.name = firstAdminName;
        user.email = firstAdminEmail;
        user.isAdmin = true;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(firstAdminPassword, salt);

        try {
            await user.save();
            console.log('First admin creation successful, email: ' + user.email);
        } catch (error) {
            console.log('error ocurred while creating first admin: ' + error);
        }
    } else {
        console.log('First admin exists, skipping creation...');
    }

    return;
}

exports.profileInfo = profileInfo;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.getAllUser = getAllUser;
exports.findUserById = findUserById;
exports.deleteSingleUser = deleteSingleUser;
exports.createFirstAdmin = createFirstAdmin;