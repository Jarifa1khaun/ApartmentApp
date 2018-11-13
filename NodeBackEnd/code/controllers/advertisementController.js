const _ = require('lodash');

const Advertisement = require('../models/advertisement');
const advertisementValidator = require('../validators/advertisementValidator');

async function createAdvertisement(req, res) {

    const {
        error
    } = advertisementValidator.validateAdvertisement(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let advertisement = new Advertisement(_.pick(req.body, ['name', 'user', 'created_on']));
    await advertisement.save();

    return res.send(advertisement);
};

// async function updateUser(req, res) {

//     const {
//         error
//     } = userValidator.validateUserWithoutRequired(req.body);

//     if (error) return res.status(400).send(error.details[0].message);    

//     let user = await User.findOne({
//         _id: req.body._id
//     });

//     if (!user) return res.status(400).send('No user found for this id.');
    
//     user = _.pick(req.body, ['name', 'email', 'isAdmin']);
//     if (req.body.password) {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password, salt);
//     }    
    
//     User.findOneAndUpdate({ _id: req.body._id }, user, {upsert:true}, function(err, user){
//         if (err) return res.send(500, { error: err });
//         return res.send("successfully updated");
//     });        
// };

async function deleteSingleAdvertisement(req, res) {
    Advertisement.deleteOne({
        _id: req.body._id
    }, function (err) {
        if (error) return res.status(400).send(error.details[0].message);
    });
    return res.status(200).send('advertisement deletion successful');
}

async function getAllAdvertisement(req, res) {

    Advertisement.find({}, function (err, advertisements) {
        if (err) {
            if (error) return res.status(500).send(error.details[0].message);
        } else {            
            res.send(advertisements);
        }
    });
}

async function findAdvertisementById(req, res) {

    const advertisement = await Advertisement.findById(req.params.id);
    res.send(advertisement);
}

exports.createAdvertisement = createAdvertisement;
// exports.updateUser = updateUser;
exports.getAllAdvertisement = getAllAdvertisement;
exports.findAdvertisementById = findAdvertisementById;
exports.deleteSingleAdvertisement = deleteSingleAdvertisement;