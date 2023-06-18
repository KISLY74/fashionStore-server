const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/create', orderController.createOrder)
router.get('/all', orderController.getAllOrders)
router.get('/all/:id', orderController.getAllOrdersByUser)
router.get('/all/:id/:status', orderController.getOrdersByStatusOfUser)
router.get('/allByStatus/:status', orderController.getOrdersByStatus)
router.put('/status/:id/:status', orderController.changeStatusOrder)
router.get('/length/:id/:ged', orderController.getLenOrders)

module.exports = router