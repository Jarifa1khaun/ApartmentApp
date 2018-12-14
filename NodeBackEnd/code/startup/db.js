const mongoose = require('mongoose');

const UserController = require('../controllers/userController');

module.exports = function() {
  const DB_URI = process.env.DB_URI;
  mongoose.connect(DB_URI)
    .then(function() {

      console.log('Connected to MongoDB...');
      UserController.createFirstAdmin();
    });
}