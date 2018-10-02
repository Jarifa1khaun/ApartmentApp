const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  mongoose.connect(config.get('mongoURL'))
    .then(() => console.log('Connected to MongoDB...'));
}
