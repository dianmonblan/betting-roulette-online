const express = require('express'),
  debug = require("debug")("app:routers:roulette"),
  RouletteModel = require('../models/roulette')

var router = express.Router()

router.get('/', (request, response, next) => {
  debug("List Roulette")
  return (new RouletteModel()).list()
    .then((result) => response.json(result))
    .catch((error) => next(error))
})

router.post('/', (request, response, next) => {
  debug("Create Roulette")
  return (new RouletteModel()).create()
    .then((result) => response.json(result))
    .catch((error) => next(error))
})

router.put('/open/:id', (request, response, next) => {
  debug("Open Roulette", request.params.id)
  return (new RouletteModel(request.params.id)).open()
    .then((result) => response.json(result))
    .catch((error) => next(error))
})

router.post('/bet/:id', (request, response, next) => {
  debug("Bet Roulette", request.params.id, request.body, request.headers)
  if (!request.headers.authorization)
    return next('User not connected!')

  request.body.usrerId = Number(request.headers.authorization)

  return (new RouletteModel(request.params.id)).bet(request.body)
    .then((result) => response.json(result))
    .catch((error) => next(error))
})

router.put('/close/:id', (request, response, next) => {
  debug("Close Roulette", request.params.id)
  return (new RouletteModel(request.params.id)).close(request.params.id)
    .then((result) => response.json(result))
    .catch((error) => next(error))
})

module.exports = router