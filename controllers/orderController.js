const ApiError = require('../exceptions/apiError')
const { Basket, BasketProducts, User, ProductAttributes, Product, Order, OrderProducts, ProductAttributeValues, ProductImages, Attribute, AttributeValue } = require('../models/models')

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { email, ids, deliveryMethod, paymentMethod, price, address } = req.body
      const user = await User.findOne({ where: { email } })
      const basket = await Basket.findOne({ where: { userId: user.id } })
      const order = await Order.create({ userId: user.id, paymentMethod, deliveryMethod, price, address })

      ids.map(async (el) => {
        await OrderProducts.create({ orderId: order.id, productAttributeValueId: el.id, count: el.count })
        await BasketProducts.destroy({ where: { basketId: basket.id, productAttributeValueId: el.id } })
      })

      return res.json(order)
    } catch (e) {
      next(e);
    }
  }
  async getAllOrders(req, res, next) {
    try {
      const orders = await Order.findAll()
      const ordersRes = await OrderController.getOrders(orders)

      return res.json(ordersRes)
    } catch (e) {
      next(e);
    }
  }
  async removeOrder(req, res, next) {
    try {
      const { email, productId, attributeValues, count } = req.body

      const user = await User.findOne({ where: { email } })
      const productAttribute = await ProductAttributes.findOne({ where: { productId, attributeValues } })
      const basketProduct = await BasketProducts.findOne({ where: { productAttributeId: productAttribute.id } })
      const basket = await Basket.findOne({ where: { userId: user.id } })

      if (basketProduct)
        throw ApiError.BadRequest("Товар уже лежит в корзине")

      await BasketProducts.create({
        basketId: basket.id,
        productAttributeId: productAttribute.id,
        count
      })

      return res.json(basketProduct)
    } catch (e) {
      next(e);
    }
  }
  async changeStatusOrder(req, res, next) {
    try {
      const { id, status } = req.params
      const order = await Order.update({ status }, { where: { id } })

      return res.json(order)
    } catch (e) {
      next(e);
    }
  }
  async getAllOrdersByUser(req, res, next) {
    try {
      const { id } = req.params
      const orders = await Order.findAll({ where: { userId: id } })
      const ordersRes = await OrderController.getOrders(orders)

      return res.json(ordersRes)
    } catch (e) {
      next(e);
    }
  }
  static async getOrders(orders) {
    let ordersRes = []

    for (let i = 0; i < orders.length; i++) {
      const user = await User.findOne({ where: { id: orders[i].userId } })
      const orderProducts = await OrderProducts.findAll({ where: { orderId: orders[i].id } })
      let products = []

      const attribute = await Attribute.findOne({ where: { name: "Цвет" } })

      if (!attribute)
        throw ApiError.BadRequest("Атрибут цвет не найден")

      const attributeValues = await AttributeValue.findAll({ where: { attributeId: attribute.id } })

      for (let j = 0; j < orderProducts.length; j++) {
        const productAttributeValue = await ProductAttributeValues.findOne({ where: { id: orderProducts[j].productAttributeValueId } })
        const product = await Product.findOne({ where: { id: productAttributeValue.productId } })

        for (let k = 0; k < attributeValues.length; k++) {
          if (productAttributeValue.attributeValues.find(val => val === attributeValues[k].value)) {
            const color = productAttributeValue.attributeValues.find(val => val === attributeValues[k].value)
            const productImage = await ProductImages.findOne({ where: { productId: product.id, color } })

            if (!productImage)
              throw ApiError.BadRequest("Нет изображения")

            products.push({
              img: productImage.img,
              count: orderProducts[j].count,
              attributeValues: productAttributeValue.attributeValues,
              product
            })
          }
        }
      }

      ordersRes.push({
        ...orders[i].dataValues,
        email: user.email,
        products
      })
    }

    return ordersRes
  }
  async getOrdersByStatus(req, res, next) {
    try {
      const { status } = req.params

      if (!status)
        throw ApiError.BadRequest("Статус не указан")

      const orders = await Order.findAll({ where: { status } })
      const ordersRes = await OrderController.getOrders(orders)

      return res.json(ordersRes)
    } catch (e) {
      next(e);
    }
  }
  async getOrdersByStatusOfUser(req, res, next) {
    try {
      const { id, status } = req.params

      if (!status)
        throw ApiError.BadRequest("Статус не указан")

      const orders = await Order.findAll({ where: { userId: id, status } })
      const ordersRes = await OrderController.getOrders(orders)

      return res.json(ordersRes)
    } catch (e) {
      next(e);
    }
  }
  async getLenOrders(req, res, next) {
    try {
      const { id, ged } = req.params
      const data = await ProductAttributeValues.findAll({ where: { productId: id } })

      let sum = 0

      for (let i = 0; i < data.length; i++) {
        const orders = await OrderProducts.findAll({ where: { productAttributeValueId: data[i].id } })
        for (let j = 0; j < orders.length; j++) {
          sum += orders[j].count
        }
      }

      const result = await OrderController.setBuy(id, sum)

      return res.json(result)
    } catch (e) {
      next(e)
    }
  }

  static async setBuy(id, sum) {
    const product = await Product.findOne({ where: { id: id } })
    product.buy = sum
    await product.save()
    return product
  }
}

module.exports = new OrderController()