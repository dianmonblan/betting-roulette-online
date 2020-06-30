var db

// Simple simulate singleton design pattern
if (!db) {
    const MongoClient = require('mongodb').MongoClient,
        debug = require("debug")("app:helpers:database"),
        URL_DATABASE = process.env.URL_DATABASE || 'mongodb://localhost:27017',
        NAME_DATABASE = process.env.NAME_DATABASE || 'betting-roulette'

    const client = new MongoClient(URL_DATABASE, { useUnifiedTopology: true })
    client.connect((error) => {
        if (error)
            throw "Connected error database to server"

        debug("Connected successfully database to server")

        db = client.db(NAME_DATABASE)

        debug("Database", db)
    })
}

module.exports = () => db