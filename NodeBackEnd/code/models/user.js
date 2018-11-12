const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() { 
  const jwtPrivateKey =process.env.JWT_PRIVATE_KEY;
  console.log(`private key is: ${jwtPrivateKey}`);
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, jwtPrivateKey);
  return token;
}

module.exports = mongoose.model('User', userSchema, 'users');