const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/create', orderController.createOrder)
router.get('/all', orderController.getAllOrders)
router.get('/all:email', orderController.getAllOrdersByUser)
router.get('/allByStatus/:status', orderController.getOrdersByStatus)
router.put('/status/:id/:status', orderController.changeStatusOrder)

module.exports = router