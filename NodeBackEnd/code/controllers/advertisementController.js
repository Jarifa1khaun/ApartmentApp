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

            if (req.user.isAdmin === true || advertisementFromDb.user.toString() === req.user._id.toString()) {

                let advertisement = new Advertisement(req.body);
                delete advertisement._id;
                advertisement.user = req.user._id
                advertisement.location = {
                    type: "Point",
                    coordinates: [req.body.long, req.body.lat]
                };
                
                Advertisement.update({
                    _id: advertisementFromDb._id
                }, advertisement, function (err, advertisement) {

                    if (error) return res.status(500).send({
                        message: error
                    });
                    return res.status(200).send({
                        message: "successfully updated"
                    });
                });

                nearbyUpdate(advertisement);
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

        await Advertisement.count({})
            .then(function (cnt) {
                count = cnt;
            })
            .catch(function (err) {
                res.status(500).send({
                    message: err
                });
            });

        Advertisement.find({}, {}, query)
            .populate('user', ['_id', 'name'])
            .select('_id name invalid_after user.name')
            .then(function (advertisements) {

                let response = {
                    advertisementList: advertisements,
                    totalCount: count
                };
                res.status(200).send(response);

            })
            .catch(function (error) {

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

        await Advertisement.count({
            user: userId
        }).then(function (cnt) {
            count = cnt;
        }).catch(function (err) {
            res.status(500).send({
                message: err
            });
        });

        Advertisement.find({
            user: userId
        }, {}, query)
        .select('_id name invalid_after')
        .then(function (advertisements) {
            let response = {
                advertisementList: advertisements,
                totalCount: count
            };
            res.status(200).send(response);
        }).catch(function (err) {
            res.status(500).send({
                message: err
            });
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

    let count = 0;

    const lat = req.body.center_lat;
    const long = req.body.center_long;
    const radius = req.body.radius;
    const subletVal = req.body.sublet;
    
    try {

        Advertisement.find({
            sublet: subletVal,
            is_rented: false
        }, {}, {})
        .populate('user', ['_id', 'name'])
        .then( async function (advertisements) {

            let outputArray = []; 
            let arr = [];

            if (advertisements !== null && advertisements.length !== 0) {

                const filteredArray = await filterArray(advertisements, lat, long, radius);
                if (filteredArray !== null && filteredArray.length !== 0) {

                    count = filteredArray.length;
                    const sortedAds = await algorithm.getSortedArray(req.body, filteredArray); 
                    outputArray = await sliceArray(sortedAds, pageSize, pageNumber);
                    
                    for (i in outputArray) {
                        arr.push(outputArray[i].rank);
                    }
                }
            }

            let returnObj = {
                adList: outputArray,
                totalCount: count,
                ranks: arr
            };

            return res.status(200).send(returnObj);
        }).catch(function (err) {
            console.log(err);
            res.status(500).send({
                message: err
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "something wrong happened."
        });
    }
}

async function filterArray(inputArray, center_lat, center_long, radius) {

    for (var index = 0; index < inputArray.length; index++) {

        var item = inputArray[index];
        var db_lat = item.lat;
        var db_long = item.long;
        
        var result = await mapUtils.isPointInCircle(center_lat, center_long, db_lat, db_long, radius);

        if (result !== true) {
            inputArray.splice(index, 1);
            index--;
        }
    }

    return inputArray;
}

async function sliceArray(inputArray, pageSize, pageNumber) {

    let query = {};
    let outputArray = [];
    let size = inputArray.length;

    query.skip = pageSize * (pageNumber - 1);
    query.limit = query.skip + pageSize;
    
    if (query.limit > size) {
        query.limit = size;
    }

    if (query.skip > size) {
        return outputArray;
    }
    
    for (var i = query.skip; i < query.limit; i++) {

        outputArray.push(_.pick(inputArray[i], ['_id', 'name', 'invalid_after', 'user.name', 'rank']));
    }

    return outputArray;
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