const _ = require('lodash');

const Advertisement = require('../models/advertisement');
const advertisementValidator = require('../validators/advertisementValidator');

const mapUtils = require('../helper/mapsUtil');
const algorithm = require('../helper/algo');

async function createAdvertisement(req, res) {

    const {
        error
    } = advertisementValidator.validateAdvertisement(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let advertisement = new Advertisement(req.body);
    advertisement.user = req.user._id
    advertisement.location = {
        type: "Point",
        coordinates: [req.body.long, req.body.lat]
    };
    await advertisement.save();
    res.status(200).send(advertisement);
    nearbyUpdate(advertisement);
};

async function updateAdvertisement(req, res) {

    try {
        const advertisement = await Advertisement.findById(req.body._id);
        if (advertisement) {
            if (req.user.isAdmin === true || advertisement.user === req.user._id) {
                const status = await nearbyUpdate(advertisement);
                if (status === 200) {
                    return res.status(status).send("successfully updated.");
                } else {
                    return res.status(status).send("something wrong happened.");
                }
            } else {
                return res.status(403).send('You do not have necessary permission to perform this operation.');
            }
        } else {
            return res.status(404).send('Item not found');
        }
    } catch (error) {
        console.log(error);
    }
};

async function deleteSingleAdvertisement(req, res) {

    const advertisement = await Advertisement.findById(req.body._id);
    if (advertisement) {
        if (req.user.isAdmin === true || advertisement.user === req.user._id) {
            await Advertisement.deleteOne({
                _id: req.body._id
            }, function (err) {
                if (error) return res.status(400).send(error.details[0].message);
            });
        } else {
            return res.status(403).send('You do not have necessary permission to perform this operation.');
        }
    } else {
        return res.status(404).send('Item not found');
    }

    return res.status(200).send('advertisement deletion successful');
}

async function getAllAdvertisement(req, res) {

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

    Advertisement.find({}, {}, query, function (err, advertisements) {
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


async function getAdviceOnHouses(req, res) {

    const {
        error
    } = advertisementValidator.validateSearchCriteria(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const lat = req.body.center_lat;
    const long = req.body.center_long;
    const radius = req.body.radius;
    const subletVal = req.body.sublet;

    const advertisements = await Advertisement.find({
        location: {
            $geoWithin: {
                $center: [
                    [long, lat], radius / 1000
                ]
            }
        },
        sublet: subletVal,
        is_rented: false
    });

    const sortedAds = await algorithm.getSortedArray(req.body, advertisements);

    let arr = [];
    for (i in sortedAds) {
        arr.push(sortedAds[i].rank);
    }

    let returnObj = {
        data: sortedAds,
        ranks: arr
    };

    res.status(200).send(returnObj);
}

async function nearbyUpdate(advertisement) {

    if (advertisement) {
        try {
            const nearbyArray = await mapUtils.fillUpNearby(advertisement.lat, advertisement.long);
            advertisement.nearby = nearbyArray;
            const updatedAdvertisement = await Advertisement.findOneAndUpdate({
                _id: advertisement._id
            }, advertisement, {
                upsert: false
            });
            if (!updateAdvertisement) return 500;
            else {
                console.log('nearby updated for id: ' + updatedAdvertisement._id);
                return 200;
            };
        } catch (error) {
            console.log(error);
        }
    }
}


exports.createAdvertisement = createAdvertisement;
exports.updateAdvertisement = updateAdvertisement;
exports.getAllAdvertisement = getAllAdvertisement;
exports.findAdvertisementById = findAdvertisementById;
exports.deleteSingleAdvertisement = deleteSingleAdvertisement;
exports.findAdvertisementsByUserId = findAdvertisementsByUserId;
exports.getAdviceOnHouses = getAdviceOnHouses;