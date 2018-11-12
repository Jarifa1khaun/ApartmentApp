const _ = require('lodash');
const bcrypt = require('bcrypt');

const Advertisement = require('../models/advertisement');
const advertisementValidator = require('../validators/advertisementValidator');

/**
 * get an individual advertisement
 * @async
 * @param {id} req 
 * @param {Advertisement} res 
 */
async function getAdvertisementById(req, res) {
    const advertisement = await Advertisement.findById(req.advertisement._id);
    if (advertisement.user === req.user._id) {
        res.send(advertisement);
    }        
    else {
        return res.status(403).send('Forbidden: Access denied.');
    }
}

async function deleteAdvertisementById(req, res) {
    

}


async function createAdvertisement(req, res) {

    const { error } = userValidator.validateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    });

    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
};

exports.createUser = createUser;
exports.profileInfo = profileInfo;