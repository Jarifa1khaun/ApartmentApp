const config = require('config');

module.exports = function() {

  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }

  if (!config.get('mongoURL')) {
    throw new Error('FATAL ERROR: mongodb URL is not defined.');
  }
}
