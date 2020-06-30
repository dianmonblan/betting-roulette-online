/*
 * Overwriting the express response.json() method to grant a layer of security 
 * over JSONP requests. The implementation is based on express's native 
 * response.json () method.
 */
const debug = require("debug")("app:helpers:noPropagationJSONP"),
    deprecate = require('depd')('express')

module.exports = function (request, response, next) {
    debug("Middleware No propagation JSONP")

    response.json = function (data) {
        debug('Response function')

        if (arguments.length === 2) {
            // response.json(body, status) backwards compat
            if (typeof arguments[1] === 'number') {
                deprecate('response.json(obj, status): Use response.status(status).json(object) instead')
                this.statusCode = arguments[1]
            } else {
                deprecate('response.json(status, object): Use response.status(status).json(object) instead')
                this.statusCode = arguments[0]
                data = arguments[1]
            }
        }

        const REPLACER = this.app.get('json replacer'),
            JSON_SPACES = this.app.get('json spaces'),
            STRIP_TAGS_JSONP = process.env.STRIP_TAGS_JSONP || ")]}',\n"

        var body

        if (REPLACER || JSON_SPACES)
            body = JSON.stringify(data, REPLACER, JSON_SPACES)
        else
            body = JSON.stringify(data)

        if (!this.get('Content-Type'))
            this.set('Content-Type', 'application/json')

        return this.send(`${STRIP_TAGS_JSONP}${body}`)
    }

    next()
}