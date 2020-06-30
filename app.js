const express = require('express'),
    path = require('path')

var app = express()

app.use(require('morgan')('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.use(express.static(path.join(__dirname, 'public')));

// No propagation JSONP
app.use(require('./helpers/noPropagationJSONP'));

// Public end-points
app.use('/', require('./routes/index'));

// Connect user
app.use(function (request, response, next) {
    return next()
})

// Private end-points
app.use('/users', require('./routes/users'));

// Default handler error
app.use(function (error, request, response, next) {
    response.status(error.status || 500);
    return response.json({ error: error });
});

module.exports = app;
