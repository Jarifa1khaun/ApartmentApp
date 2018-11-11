const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../api/swagger/swagger.json');

module.exports = function(app) {
  
  app.use(express.json());

  app.use('/api/users', users);
  app.use('/api/auth', auth);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(error);
}