const winston = require('winston');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
