const _ = require('lodash');

const Advertisement = require('../models/advertisement');
const advertisementValidator = require('../validators/advertisementValidator');

const mapUtils = require('../helper/mapsUtil');
const algorithm = require('../helper/algo');

async function createAdvertisement(req, res) {

    const {
        error
    } = advertisementValidator.validateAdvertisement(req.body);

    if (error) return res.status(400).send({
        message: error.details[0].message
    });

    let advertisement = new Advertisement(req.body);
    advertisement.user = req.user._id
    advertisement.location = {
        type: "Point",
        coordinates: [req.body.long, req.body.lat]
    };

    try {
        await advertisement.save();
    } catch (error) {
        return res.status(500).send({
            message: "something wrong happened."
        });
    }

    res.status(200).send(advertisement);
    nearbyUpdate(advertisement);
};

async function updateAdvertisement(req, res) {

    const {
        error
    } = advertisementValidator.validateAdvertisementWithoutRequired(req.body);

    if (error) return res.status(400).send({
        message: error.details[0].message
    });

    try {
        const advertisementFromDb = await Advertisement.findById(req.body._id);
        if (advertisementFromDb) {
            if (req.user.isAdmin === true || advertisementFromDb.user === req.user._id) {

                Advertisement.findOneAndUpdate({
                    _id: req.body._id
                }, req.body, {
                    upsert: false
                }, function (err, advertisement) {
                    if (error) return res.status(500).send({
                        message: error
                    });
                    return res.status(200).send({
                        message: "successfully updated"
                    });
                });

                nearbyUpdate(advertisementFromDb);
            } else {
                return res.status(403).send({
                    message: 'You do not have necessary permission to perform this operation.'
                });
            }
        } else {
            return res.status(404).send({
                message: 'Item not found'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "something wrong happened"
        });
    }
};

async function deleteSingleAdvertisement(req, res) {

    try {
        const advertisement = await Advertisement.findById(req.params.id);

        if (advertisement) {
            if (req.user.isAdmin === true || advertisement.user === req.user._id) {
                try {
                    await Advertisement.deleteOne({
                        _id: req.params.id
                    }, function (err) {
                        if (err) return res.status(400).send({
                            message: error.details[0].message
                        });
                    });
                } catch (error) {
                    return res.status(500).send({
                        message: "something wrong happened."
                    });
                }
            } else {
                return res.status(403).send({
                    message: 'You do not have necessary permission to perform this operation.'
                });
            }
        } else {
            return res.status(404).send({
                message: 'Item not found'
            });
        }

        return res.status(200).send({
            message: 'advertisement deletion successful'
        });
    } catch (error) {
        return res.status(500).send({
            message: "something wrong happened."
        });
    }
}

async function getAllAdvertisement(req, res) {

    let query = {}
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);

    if (isNaN(pageNumber) || pageNumber < 0 || pageNumber === 0) {
        return res.status(400).send({
            message: "invalid page number, should start from 1."
        });
    }

    if (isNaN(pageSize) || pageSize < 0 || pageSize === 0) {
        return res.status(400).send({
            message: "invalid page size, should be greater than 0."
        });
    }

    query.limit = pageSize;
    query.skip = pageSize * (pageNumber - 1);

    let count = 0;

    try {
        Advertisement.count({}, function (err, cnt) {
            if (err) {
                res.status(500).send({
                    message: err
                });
            } else {
                count = cnt;
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "something wrong happened."
        });
    }

    Advertisement.find({}, {}, query, function (err, advertisements) {
        if (err) {
            if (error) return res.status(500).send({
                message: error.details[0].message
            });
        } else {
            let response = {
                advertisementList: advertisements,
                totalCount: count
            };
            res.status(200).send(response);
        }
    });
}

async function findAdvertisementById(req, res) {

    try {
        const advertisement = await Advertisement.findById(req.params.id);

        if (!advertisement) return res.status(404).send({
            message: "advertisement not found."
        });

        return res.status(200).send(advertisement);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "something wrong happened."
        });
    }
}

async function findAdvertisementsByUserId(req, res) {

    let userId = req.params.id;
    if (!userId) {
        userId = req.user._id;
    }

    let query = {}
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);

    if (isNaN(pageNumber) || pageNumber < 0 || pageNumber === 0) {
        return res.status(400).send({
            message: "invalid page number, should start from 1."
        });
    }

    if (isNaN(pageSize) || pageSize < 0 || pageSize === 0) {
        return res.status(400).send({
            message: "invalid page size, should be greater than 0."
        });
    }

    query.limit = pageSize;
    query.skip = pageSize * (pageNumber - 1);

    let count = 0;

    try {
        Advertisement.count({
            user: userId
        }, function (err, cnt) {
            if (err) {
                res.status(500).send({
                    message: err
                });
            } else {
                count = cnt;
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "something wrong happened."
        });
    }

    try {
        Advertisement.find({
            user: userId
        }, {}, query, function (err, advertisements) {
            if (err) {
                res.status(500).send({
                    message: err
                });
            } else {
                let response = {
                    advertisementList: advertisements,
                    totalCount: count
                };
                res.status(200).send(response);
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "something wrong happened."
        });
    }
}

async function getAdviceOnHouses(req, res) {

    const {
        error
    } = advertisementValidator.validateSearchCriteria(req.body);

    if (error) return res.status(400).send({
        message: error.details[0].message
    });

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

    let count = arr.length;

    let returnObj = {
        data: sortedAds,
        ranks: arr,
        totalCount: count
    };

    return res.status(200).send(returnObj);
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