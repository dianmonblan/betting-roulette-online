const express = require('express'),
    debug = require("debug")("app"),
    path = require('path')

var app = express()

app.use(require('morgan')('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('cookie-parser')())
app.use(express.static(path.join(__dirname, 'public')))

// Connect and Strat-up database
require('./helpers/database')

// No propagation JSONP
app.use(require('./helpers/noPropagationJSONP'))

// Connect user
app.use((request, response, next) => {
    debug('Connect user')
    return next()
})

// End-points (Routers)
app.use('/', require('./routes/index'))
app.use('/roulette', require('./routes/roulette'))

// Default handler error
app.use((error, request, response, next) => {
    debug('Default handler error')
    response.status(error.status || 500)
    return response.json({ error: error })
})

module.exports = app
