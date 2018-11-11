const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');


router.get('/me', auth, userController.profileInfo);

// router.get('/', userController.createUser);
router.post('/', userController.createUser);
// router.put('/', userController.createUser);
// router.delete('/', userController.createUser);


module.exports = router; 