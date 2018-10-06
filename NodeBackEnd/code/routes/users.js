const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');


router.get('/me', auth, userController.profileInfo);

router.post('/', userController.createUser);

module.exports = router; 