const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Advertisement = require('./advertisement');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
  const sessionDuration = process.env.SESSION_DURATION;

  const token = jwt.sign({
    _id: this._id,
    isAdmin: this.isAdmin,
    validity: new Date().getTime() + sessionDuration * 60 * 1000
  }, jwtPrivateKey); // change 5
  return token;
}

userSchema.pre('remove', function (next) {
  Advertisement.remove({
    user: this._id
  }).exec();
  next();
});

module.exports = mongoose.model('User', userSchema, 'users');