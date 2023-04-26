const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const errorHandler = require('./plugins/errorHandler');
const di = require('./di');
const app = express();

app.set('di', di);

require('./plugins/cors')(app);
require('./plugins/session')(app, di);
require('./plugins/sentry')(app);

const router = require('./routes')(di);

app.use(helmet());
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

module.exports = app;
