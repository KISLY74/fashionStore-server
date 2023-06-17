const ApiError = require('../exceptions/apiError')
const { Attribute, CategoryAttributes, Category, ProductAttributes } = require('../models/models')

class AttributeController {
  async addAttribute(req, res, next) {
    try {
      const { name } = req.body
      const attribute = await Attribute.findOne({ where: { name } })

      if (attribute)
        throw new ApiError(400, "Такой атрибут уже существует")

      const data = await Attribute.create({ name })
      return res.json(data)
    } catch (e) {
      next(e);
    }
  }
  async changeAttribute(req, res, next) {
    try {
      const { newName } = req.body
      const { id } = req.params
      const attribute = await Attribute.findOne({ where: { id } })
      const result = await Attribute.update({ name: newName }, { where: { id } })

      if (!attribute)
        throw new ApiError(400, "Атрибут не найден")

      return res.json(result)
    } catch (e) {
      next(e);
    }
  }
  async getAttribute(req, res, next) {
    try {
      const { name } = req.params
      const attribute = await Attribute.findOne({ where: { name } })

      if (!attribute)
        throw new ApiError(400, "Атрибут не найден")

      return res.json(attribute)
    } catch (e) {
      next(e);
    }
  }
  async deleteAttribute(req, res, next) {
    try {
      const { id } = req.params
      const attribute = await Attribute.findOne({ where: { id } })

      if (!attribute)
        throw new ApiError(400, "Атрибут не найден")

      await Attribute.destroy({ where: { id } })

      return res.json(attribute)
    } catch (e) {
      next(e);
    }
  }
  async getAllAttributes(req, res, next) {
    try {
      const attributes = await Attribute.findAll()

      if (!attributes)
        throw ApiError.BadRequest("Атрибуты не найдены")

      return res.json(attributes)
    } catch (e) {
      next(e)
    }
  }
  async getAttributesByProduct(req, res, next){
    try {
      const { id } = req.params
      const data = await ProductAttributes.findAll({ where: { productId: id } })

      let attributes = []

      for (let i = 0; i < data.length; i++) {
        await Attribute.findOne({ where: { id: data[i].attributeId } })
          .then((attribute) => attributes.push(attribute.name))
      }

      return res.json(attributes)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new AttributeController()