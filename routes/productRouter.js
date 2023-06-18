const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')

router.post('/add', productController.addProduct)
router.delete('/delete', productController.deleteProduct)
router.get('/all', productController.getAllProducts)
router.post('/getById', productController.getProductById)
router.post('/getImage', productController.getProductImageByColor)
router.post('/getCount', productController.getCountProduct)
router.post('/getAllCountById', productController.getProductsAvailability)
router.post('/addCount', productController.addProductAttributes)
router.post('/addImage', productController.addProductImage)
router.post('/getAllImagesById', productController.getProductImages)
router.get('/amount/:id', productController.getAmountProduct)
router.get('/attributeValues/:id', productController.getAttributeValuesByProduct)
router.get('/filterBy/:gender/:categoryName/:subCategoryName/:priceMinMax/:priceSort/:isTop/:query', productController.getProductsByFilter)

module.exports = router