const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/regin', userController.regin)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.post('/update', userController.update)
router.post('/info/:id', userController.getInfo)
router.post('/rate', userController.changeRating)
router.get('/rate/:userId/:productId', userController.getRating)

module.exports = router