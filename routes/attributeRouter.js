const Router = require('express')
const router = new Router()
const attributeController = require('../controllers/attributeController')

router.post('/add', attributeController.addAttribute)
router.delete('/delete/:id', attributeController.deleteAttribute)
router.put('/change/:id', attributeController.changeAttribute)
router.get('/get/:name', attributeController.getAttribute)
router.get('/all', attributeController.getAllAttributes)
router.get('/allByProduct/:id', attributeController.getAttributesByProduct)

module.exports = router