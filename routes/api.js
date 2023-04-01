const express = require('express')
const router = express.Router()
const apis = require('../controllers/apis/api')

router.get('/', apis.api)
router.get('/trend', apis.tempTrend)
router.get('/minMax', apis.minMaxTrend)
router.get('/compCities', apis.compCities)

module.exports = router