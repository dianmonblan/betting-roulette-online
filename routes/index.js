const express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (request, response) {
  return response.render('index', { title: 'API ONLINE BETTING ROULETTE' })
})

module.exports = router
