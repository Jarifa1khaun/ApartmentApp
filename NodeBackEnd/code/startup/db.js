const mongoose = require('mongoose');

module.exports = function() {
  const DB_URI = process.env.DB_URI;
  mongoose.connect(DB_URI)
    .then(() => console.log('Connected to MongoDB...'));
}