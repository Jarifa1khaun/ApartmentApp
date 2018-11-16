const _ = require('lodash');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const userValidator = require('../validators/userValidator');

async function profileInfo(req, res) {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
}

async function createUser(req, res) {
    const {
        error
    } = userValidator.validateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    });

    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
};

async function updateUser(req, res) {

    if (req.user.isAdmin === true || req.user._id === req.body._id) {
        const {
            error
        } = userValidator.validateUserWithoutRequired(req.body);
    
        if (error) return res.status(400).send(error.details[0].message);    
    
        let user = await User.findOne({
            _id: req.body._id
        });
    
        if (!user) return res.status(404).send('No user found for this id.');
        
        user = _.pick(req.body, ['name', 'email', 'isAdmin']);
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }    
        
        User.findOneAndUpdate({ _id: req.body._id }, user, {upsert:true}, function(err, user){
            if (err) return res.send(500, { error: err });
            return res.send("successfully updated");
        });
    } else {
        res.status(403).send('You do not have necessary permission to perform this operation.');
    }
    
};

async function deleteSingleUser(req, res) {
    User.deleteOne({
        _id: req.body._id
    }, function (err) {
        if (error) return res.status(400).send(error.details[0].message);
    });
    return res.status(200).send('user deletion successful');
}

async function getAllUser(req, res) {

    let query = {}
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);    

    if (pageNumber < 0 || pageNumber === 0) {
        response = {
            "error": true,
            "message": "invalid page number, should start from 1."
        };
        return res.status(400).json(response);
    }

    if (pageSize < 0 || pageSize === 0) {
        response = {
            "error": true,
            "message": "invalid page size, should be greater than 0."
        };
        return res.status(400).json(response);
    }

    query.skip = pageSize * (pageNumber - 1);
    query.limit = pageSize;

    User.find({}, {}, query, function (err, users) {
        if (err) {
            if (error) return res.status(500).send(error.details[0].message);
        } else {            
            res.send(_.map(users, _.partialRight(_.pick, ['_id', 'name', 'email', 'isAdmin'])));
        }
    });
}

async function findUserById(req, res) {

    const user = await User.findById(req.params.id);   
    res.send(_.pick(user, ['name', 'email', 'isAdmin']));
}

exports.profileInfo = profileInfo;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.getAllUser = getAllUser;
exports.findUserById = findUserById;
exports.deleteSingleUser = deleteSingleUser;