const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const advertisementController = require('../controllers/advertisementController');

router.get('/', [auth, admin], advertisementController.getAllAdvertisement);
router.get('/:id', [auth, admin], advertisementController.findAdvertisementById);
router.post('/', advertisementController.createAdvertisement);
// router.put('/', userController.updateUser);
router.delete('/', [auth, admin], advertisementController.deleteSingleAdvertisement);

module.exports = router;