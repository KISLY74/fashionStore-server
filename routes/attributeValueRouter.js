const Router = require('express')
const router = new Router()
const attributeValueController = require('../controllers/attributeValueController')

router.post('/add', attributeValueController.addAttributeValue)
router.delete('/delete/:id', attributeValueController.deleteAttributeValue)
router.put('/change/:id', attributeValueController.changeAttributeValue)
router.get('/get/:value', attributeValueController.getAttributeValue)
router.get('/all/:id', attributeValueController.getValuesByAttribute)

module.exports = router