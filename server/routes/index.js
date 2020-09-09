const express = require('express');

const app = express();

app.use(require('./car'));
app.use(require('./reserve'));
app.use(require('./user'));
app.use(require('./login'));
app.use(require('./upload'));

module.exports = app;