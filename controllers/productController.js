const { Op } = require("sequelize")
const ApiError = require('../exceptions/apiError')
const { Product, SubCategory, ProductAttributes, ProductImages, ProductAttributeValues, Attribute, Category, AttributeValue, OrderProducts, Rating } = require('../models/models')
const uuid = require('uuid')
const path = require('path')
const imageService = require('../service/imageService')

class ProductController {
  async addProduct(req, res, next) {
    try {
      const { name, price, subCategoryName, attributeValues, count } = req.body
      const { img } = req.files

      if (!attributeValues)
        throw ApiError.BadRequest("Атрибуты не указаны")

      const hasColor = Object.entries(JSON.parse(attributeValues)).find((el) => el[0] === 'Цвет')

      if (!hasColor)
        throw ApiError.BadRequest("Цвет обязательный атрибут")

      const subCategory = await SubCategory.findOne({ where: { name: subCategoryName } })
      const filename = await imageService.add(img)

      const product = await Product.create({
        name,
        price,
        categoryId: subCategory.categoryId,
        subCategoryId: subCategory.id
      })

      await ProductImages.create({
        productId: product.id,
        img: filename,
        color: JSON.parse(attributeValues)["Цвет"]
      })

      Object.keys(JSON.parse(attributeValues)).map(async (name) => {
        const { id } = await Attribute.findOne({ where: { name } })

        await ProductAttributes.create({
          attributeId: id,
          productId: product.id
        })
      })

      await ProductAttributeValues.create({
        productId: product.id,
        attributeValues: Object.values(JSON.parse(attributeValues)),
        count
      })

      return res.json(product)
    } catch (e) {
      next(e);
    }
  }
  async deleteProduct(req, res, next) {
    try {
      const { name } = req.body
      const data = await Product.destroy({ where: { name } })
      return res.json(data)
    } catch (e) {
      next(e);
    }
  }

  async getProduct(req, res, next) {
    try {
      const { name } = req.body
      const data = await Product.destroy({ where: { name } })
      return res.json(data)
    } catch (e) {
      next(e);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const data = await Product.findAll()

      return res.json(data)
    } catch (e) {
      next(e);
    }
  }
  async getProductById(req, res, next) {
    try {
      const { id } = req.body
      const product = await Product.findOne({ where: { id } })
      return res.json(product)
    } catch (e) {
      next(e);
    }
  }
  async getProductImageByColor(req, res, next) {
    try {
      const { id } = req.body
      const { img } = await ProductImages.findOne({ where: { productId: id } })

      return res.json(img)
    } catch (e) {
      next(e);
    }
  }
  async getAmountProduct(req, res, next) {
    try {
      const { id } = req.params
      const amountProducts = await ProductAttributeValues.findAll({ where: { productId: id } })

      return res.json(amountProducts)
    } catch (e) {
      next(e);
    }
  }
  async getProductsByFilter(req, res, next) {
    try {
      const { gender, categoryName, subCategoryName, priceMinMax, priceSort, isTop, query } = req.params
      const category = await Category.findOne({ where: { name: categoryName } })
      const subCategory = await SubCategory.findOne({ where: { name: subCategoryName } })

      let filterWhere = {
        categoryId: category?.id,
        subCategoryId: subCategory?.id,
        gender: gender.toUpperCase()[4],
        price: priceMinMax !== "false" && {
          [Op.lt]: Number(priceMinMax?.split('-')[1]),
          [Op.gt]: Number(priceMinMax?.split('-')[0]),
        },
        name: query !== "false" && { [Op.iLike]: "%" + query + "%" }
      }

      for (let i in filterWhere) {
        if (!filterWhere[i])
          delete filterWhere[i]
      }

      let orderParams = [
        isTop !== "false" && ["buy", "DESC"],
        priceSort !== "false" && ["price", priceSort]
      ]

      orderParams = orderParams.filter(e => e)

      const products = await Product.findAll({
        where: filterWhere,
        order: orderParams,
      })

      for (let i = 0; i < products.length; i++)
        ProductController.changeBuy(products[i])

      return res.json(products)
    } catch (e) {
      next(e)
    }
  }
  static async changeBuy(product) {
    const data = await ProductAttributeValues.findAll({ where: { productId: product.id } })
    const ratings = await Rating.findAll({ where: { productId: product.id } })

    let sum = 0, ratesSum = 0, avg

    for (let i = 0; i < ratings.length; i++)
      ratesSum += ratings[i].rate

    if (ratings.length === 0)
      avg = 0
    else {
      avg = Number(ratesSum / ratings.length).toFixed(1)
    }

    for (let i = 0; i < data.length; i++) {
      const orders = await OrderProducts.findAll({ where: { productAttributeValueId: data[i].id } })
      for (let j = 0; j < orders.length; j++) {
        sum += orders[j].count
      }
    }

    product.set({ buy: sum, rating: avg })
    await product.save()
  }
  async getAttributeValuesByProduct(req, res, next) {
    try {
      const { id } = req.params
      const productAttributes = await ProductAttributes.findAll({ where: { productId: id } })

      const productAttributeValues = []

      for (let i = 0; i < productAttributes.length; i++) {
        const attribute = await Attribute.findOne({ where: { id: productAttributes[i].attributeId } })
        const attributeValues = await AttributeValue.findAll({ where: { attributeId: productAttributes[i].attributeId } })

        productAttributeValues.push({ attribute: attribute.name, attributeValues })
      }

      return res.json(productAttributeValues)
    } catch (e) {
      next(e);
    }
  }
  async getCountProduct(req, res, next) {
    try {
      const { id, attributeValues } = req.body
      const countProducts = await ProductAttributes.findAll({ where: { productId: id } })

      if (!countProducts)
        throw ApiError.BadRequest(`Нет в наличии`)

      const countProduct = countProducts.find(el => JSON.stringify(attributeValues) === JSON.stringify(el.attributeValues))

      if (!countProduct)
        throw ApiError.BadRequest(`Нет в наличии`)

      return res.json(countProduct.count)
    } catch (e) {
      next(e);
    }
  }
  async getProductsAvailability(req, res, next) {
    try {
      const { id } = req.body
      const products = await ProductAttributes.findAll({ where: { productId: id } })

      return res.json(products)
    } catch (e) {
      next(e);
    }
  }
  async addProductAttributes(req, res, next) {
    try {
      const { id, attributeValues, count } = req.body
      const productAmount = await ProductAttributeValues.findOne({ where: { productId: id, attributeValues } })

      if (attributeValues.length === 0)
        throw ApiError.BadRequest("Не указаны значения атрибутов")
      if (!count)
        throw ApiError.BadRequest("Не указано количество")

      if (!productAmount)
        await ProductAttributeValues.create({ productId: id, attributeValues, count })
      else {
        productAmount.count = count
        await productAmount.save()
      }

      return res.json(productAmount)
    } catch (e) {
      next(e);
    }
  }
  async addProductImage(req, res, next) {
    try {
      const { id, color } = req.body
      const { img } = req.files

      const filename = await imageService.add(img)
      const productImage = await ProductImages.findOne({ where: { productId: id, color } })

      if (!id)
        throw ApiError.BadRequest("Не указан id товара")
      if (!color)
        throw ApiError.BadRequest("Не выбран цвет")

      if (!productImage)
        await ProductImages.create({ productId: id, color, img: filename })
      else {
        productImage.img = filename
        await productImage.save()
      }

      return res.json(productImage)
    } catch (e) {
      next(e);
    }
  }
  async getProductImages(req, res, next) {
    try {
      const { id } = req.body
      const products = await ProductImages.findAll({ where: { productId: id } })

      return res.json(products)
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController()