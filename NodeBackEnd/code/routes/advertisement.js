const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mapUtils = require('../helper/mapsUtil');
const advertisementController = require('../controllers/advertisementController');

router.get('/', advertisementController.getAllAdvertisement);
router.post('/', auth, advertisementController.createAdvertisement);
router.put('/', auth, advertisementController.updateAdvertisement);
router.delete('/', auth, advertisementController.deleteSingleAdvertisement);

router.get('/getAdvertisementByUserId/:id', [auth, admin], advertisementController.findAdvertisementsByUserId);
router.get('/getAdvertisementByUserId', auth, advertisementController.findAdvertisementsByUserId);
router.get('/:id', advertisementController.findAdvertisementById);

module.exports = router;