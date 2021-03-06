const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const advertisementController = require('../controllers/advertisementController');

router.get('/', advertisementController.getAllAdvertisement);
router.post('/', auth, advertisementController.createAdvertisement);
router.put('/', auth, advertisementController.updateAdvertisement);
router.delete('/:id', auth, advertisementController.deleteSingleAdvertisement);

router.get('/getAdvertisementByUserId/:id', [auth, admin], advertisementController.findAdvertisementsByUserId);
router.get('/getAdvertisementByUserId', auth, advertisementController.findAdvertisementsByUserId);
router.get('/:id', advertisementController.findAdvertisementById);

router.post('/getAdvice', advertisementController.getAdviceOnHouses);

module.exports = router;