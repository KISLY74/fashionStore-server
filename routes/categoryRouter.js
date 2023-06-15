const Router = require('express')
const router = new Router()
const categoryController = require('../controllers/categoryController')

router.post('/get', categoryController.getNameById)

module.exports = router