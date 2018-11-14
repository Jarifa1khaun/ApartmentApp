const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const userController = require('../controllers/userController');

router.get('/me', auth, userController.profileInfo);

router.get('/', [auth, admin], userController.getAllUser);
router.get('/:id', [auth, admin], userController.findUserById);
router.post('/', userController.createUser);
router.put('/', auth, userController.updateUser);
router.delete('/', [auth, admin], userController.deleteSingleUser);

module.exports = router;