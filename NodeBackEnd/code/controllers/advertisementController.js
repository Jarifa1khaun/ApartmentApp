const _ = require('lodash');

const Advertisement = require('../models/advertisement');
const advertisementValidator = require('../validators/advertisementValidator');

const mapUtils = require('../helper/mapsUtil');

async function createAdvertisement(req, res) {

    const {
        error
    } = advertisementValidator.validateAdvertisement(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let advertisement = new Advertisement(req.body);
    await advertisement.save();
    return res.send(advertisement);
    // nearbyUpdate(advertisement);
};

async function updateAdvertisement(req, res) {

    try {
        const advertisement = await Advertisement.findById(req.body._id);
        if (advertisement) {        
            if (req.user.isAdmin === true || advertisement.user === req.user._id) {
                const status = await nearbyUpdate(advertisement);
                if (status === 200) {
                    res.status(status).send("successfully updated.");
                } else {
                    res.status(status).send("something wrong happened.");
                }
            } else {
                res.status(403).send('You do not have necessary permission to perform this operation.');
            }
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {        
        console.log(error);
    }
};

async function nearbyUpdate(advertisement) {

    if (advertisement) {
        try {
            const nearbyArray = await mapUtils.fillUpNearby(advertisement.lat, advertisement.long);
            advertisement.nearby = nearbyArray;
            const updatedAdvertisement = Advertisement.findOneAndUpdate({
                _id: advertisement._id
            }, advertisement, {
                upsert: false
            });
            if (!updateAdvertisement) return 500;
            else {
                console.log('nearby updated for id: ' + advertisement._id);
                return 200;
            };
        } catch (error) {
            console.log(error);
        }
    }
}

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


async function findAdvertisementsByUserId(req, res) {

    let userId = req.params.id;
    if (!userId) {
        userId = req.user._id;
    }

    Advertisement.find({
        user: userId
    }, function (err, advertisements) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(advertisements);
        }
    });
}

exports.createAdvertisement = createAdvertisement;
exports.updateAdvertisement = updateAdvertisement;
exports.getAllAdvertisement = getAllAdvertisement;
exports.findAdvertisementById = findAdvertisementById;
exports.deleteSingleAdvertisement = deleteSingleAdvertisement;
exports.findAdvertisementsByUserId = findAdvertisementsByUserId;