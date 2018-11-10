const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

require('./startup/routes')(app);
require('./startup/db')();
// require('./startup/config')();
require('./startup/validation')();

const port = process.env.CONTAINER_PORT;
const environment = process.env.NODE_ENV;
const jwtPrivateKey =process.env.JWT_PRIVATE_KEY;

app.listen(port, () => console.log(`${environment} server is running on port ${port} with private key ${jwtPrivateKey}...`));