const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')

router.post('/addProduct', basketController.addToBasket)
router.get('/products/:email', basketController.getBasketProducts)

module.exports = router