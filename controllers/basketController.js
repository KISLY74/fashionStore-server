const ApiError = require('../exceptions/apiError')
const { Basket, BasketProducts, User, ProductAttributes, Product, ProductAttributeValues, ProductImages, Attribute, AttributeValue } = require('../models/models')

class BasketController {
  async addToBasket(req, res, next) {
    try {
      const { email, productId, attributeValues, count } = req.body

      const user = await User.findOne({ where: { email } })
      const productAttributeValue = await ProductAttributeValues.findOne({ where: { productId, attributeValues } })

      if (!productAttributeValue)
        throw ApiError.BadRequest("Нет в наличии")

      const basketProduct = await BasketProducts.findOne({ where: { productAttributeValueId: productAttributeValue.id } })
      const basket = await Basket.findOne({ where: { userId: user.id } })

      if (basketProduct)
        throw ApiError.BadRequest("Товар уже лежит в корзине")
      if (!basket)
        throw ApiError.BadRequest("Нет корзины, должна создаваться при регистрации")

      await BasketProducts.create({
        basketId: basket.id,
        productAttributeValueId: productAttributeValue.id,
        count
      })

      return res.json(basketProduct)
    } catch (e) {
      next(e);
    }
  }
  async getBasketProducts(req, res, next) {
    try {
      const { email } = req.params

      const user = await User.findOne({ where: { email } })
      const basket = await Basket.findOne({ where: { userId: user.id } })
      const basketProducts = await BasketProducts.findAll({ where: { basketId: basket.id } })

      if (!basketProducts)
        throw ApiError.BadRequest("Корзина пуста")

      let products = []

      for (let i = 0; i < basketProducts.length; i++) {
        const productAttributeValue = await ProductAttributeValues.findOne({ where: { id: basketProducts[i].productAttributeValueId } })
        const product = await Product.findOne({ where: { id: productAttributeValue.productId } })
        const attribute = await Attribute.findOne({ where: { name: "Цвет" } })

        if (!attribute)
          throw ApiError.BadRequest("Атрибут цвет не найден")

        const attributeValues = await AttributeValue.findAll({ where: { attributeId: attribute.id } })

        for (let j = 0; j < productAttributeValue.attributeValues.length; j++) {
          for (let k = 0; k < attributeValues.length; k++) {
            if (attributeValues[k].value === productAttributeValue.attributeValues[j]) {
              const productImage = await ProductImages.findOne({ where: { productId: product.id, color: productAttributeValue.attributeValues[j] } })

              if (!productImage)
                throw ApiError.BadRequest("Нет изображения")

              products.push({
                id: productAttributeValue.id,
                count: basketProducts[i].count,
                img: productImage.img,
                attributeValues: productAttributeValue.attributeValues, product
              })
            }
          }
        }
      }

      return res.json(products)
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BasketController()