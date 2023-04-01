const express = require('express')
const router = express.Router()
const home = require('../controllers/default/home')

router.get('/', home.home)

module.exports = router