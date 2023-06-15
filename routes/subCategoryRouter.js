const Router = require('express')
const router = new Router()
const subCategoryController = require('../controllers/subCategoryController')

router.post('/add', subCategoryController.addSubCategory)
router.delete('/delete/:id', subCategoryController.deleteSubCategory)
router.put('/change/:id', subCategoryController.changeSubCategory)
router.get('/get/:name', subCategoryController.getSubCategory)
router.get('/all/:categoryName', subCategoryController.getAllByCategoryName)

module.exports = router