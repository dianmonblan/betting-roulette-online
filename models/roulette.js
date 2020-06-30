const debug = require("debug")("app:models:roulette"),
    db = require('../helpers/database'),
    ObjectId = require('mongodb').ObjectId,
    STATUS = {
        PENDING: 'pending',
        OPEN: 'open',
        CLOSE: 'close'
    },
    COLORS = ['red', 'black'],
    MINIMUM_MONEY = 10000

var Roulette = function (_id) {
    debug('Constructor Roulette')

    this._id = _id
    this._collectionName = 'roulette'
    this._collection = null
    this._status = STATUS.PENDING
    this._bet = {}
}

Roulette.prototype.collection = function () {
    if (!this._collection)
        this._collection = db().collection(this._collectionName)

    return this._collection
}

Roulette.prototype.create = function () {
    debug('Create Roulette')

    return new Promise((resolve, reject) => {
        debug('Create Roulette promise')

        this.collection().insertOne({ status: this._status, createDate: new Date() }, (error, result) => {
            if (error)
                return reject(error)

            debug("Create Roulette", result)
            return resolve(result.ops[0]._id)
        })
    })
}

Roulette.prototype.list = function () {
    debug('List Roulette')

    return new Promise((resolve, reject) => {
        debug('List Roulette promise')

        this.collection().aggregate([{
            $match: {
                status: {
                    $in: [
                        STATUS.OPEN,
                        STATUS.CLOSE
                    ]
                }
            }
        }], function (error, cursor) {
            if (error)
                return reject(error)

            debug("List Roulette cursor", cursor)
            return cursor.toArray((error, roulettes) => {
                if (error)
                    return reject(error)

                debug("List roulettes", roulettes)
                return resolve(roulettes)
            })
        })
    })
}

Roulette.prototype.open = function () {
    const _id = this._id
    debug('Open Roulette', _id)

    return new Promise((resolve, reject) => {
        debug('Open Roulette promise')

        this.collection().findOneAndUpdate({
            _id: ObjectId(_id),
            status: STATUS.PENDING
        }, { $set: { status: STATUS.OPEN } }, (error, result) => {
            if (error || !result.value)
                return reject(error)

            debug("Open Roulette", result)
            return resolve(STATUS.OPEN)
        })
    })
}

Roulette.prototype.close = function () {
    const _id = this._id
    debug('Close Roulette', _id)

    return new Promise((resolve, reject) => {
        debug('Close Roulette promise')

        this.collection().findOneAndUpdate({
            _id: ObjectId(_id),
            status: STATUS.OPEN
        }, { $set: { status: STATUS.CLOSE } }, (error, result) => {
            if (error || !result.value)
                return reject(error)

            result.value.status = STATUS.CLOSE
            debug("Close Roulette", result)
            return resolve(result.value)
        })
    })
}

Roulette.prototype.numberValidate = function () {
    debug('Bet Roulette number validate')
    this._bet.number = this._bet.number ? Number(this._bet.number) : 0

    if (!this._bet.number || this._bet.number < 0 || this._bet.number > 36)
        return true
}

Roulette.prototype.colorValidate = function () {
    debug('Bet Roulette color validate')

    if (!this._bet.color || !COLORS.includes(this._bet.color))
        return true
}

Roulette.prototype.moneyValidate = function () {
    debug('Bet Roulette money validate')
    this._bet.money = this._bet.money ? Number(this._bet.money) : 0

    if (this._bet.money < MINIMUM_MONEY)
        return true
}

Roulette.prototype.betValidate = function () {
    debug('Bet Roulette betValidate')
    var error = null

    if (!this._bet.color && this.numberValidate()) {
        error = 'Select the bet number!'
        delete this._bet.number
    }

    if (!this._bet.number && this.colorValidate()) {
        error = 'Select the bet color!'
        delete this._bet.color
    }

    if (this.moneyValidate())
        error = 'Money not allowed!'

    return error
}

Roulette.prototype.bet = function (bet) {
    this._bet = bet
    var _self = this

    debug('Bet Roulette', _self._id, this._bet)

    const errorValidate = this.betValidate()
    debug('Bet Roulette promise error validate', errorValidate)

    return new Promise((resolve, reject) => {
        debug('Bet Roulette promise')

        if (errorValidate)
            reject(errorValidate)

        _self.bet.creationDate = new Date()
        debug('Bet Roulette promise bet', _self._bet)

        this.collection().findOneAndUpdate({
            _id: ObjectId(_self._id),
            status: STATUS.OPEN
        }, { $push: { bets: _self._bet } }, (error, result) => {
            if (error || !result.value)
                return reject(error)

            debug("Bet Roulette", _self._bet)
            return resolve(_self._bet)
        })
    })
}

module.exports = Roulette