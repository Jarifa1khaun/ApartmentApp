const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const config = require('config');

module.exports = function() {
  winston.handleExceptions(
    new winston.transports.File(
      { filename: 'uncaughtExceptions.log' }
    )
  );

  process.on('unhandledRejection', (ex) => {
    console.log('unhandled promise');
  });

  winston.add(winston.transports.File, { filename: 'logfile.log' });

  winston.add(winston.transports.MongoDB, {
    db: config.get('mongoURL'),
    level: 'info'
  });
}
