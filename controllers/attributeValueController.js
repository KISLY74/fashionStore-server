const ApiError = require('../exceptions/apiError')
const { Attribute, AttributeValue } = require('../models/models')

class AttributeValueController {
  async addAttributeValue(req, res, next) {
    try {
      const { name, value } = req.body
      const attribute = await Attribute.findOne({ where: { name } })
      const attributeValue = await AttributeValue.findOne({ where: { value } })

      if (!attribute)
        throw new ApiError(400, "Атрибут не найден")
      if (attributeValue)
        throw new ApiError(400, "Такое значение атрибута уже существует")

      const data = await AttributeValue.create({ attributeId: attribute.id, value })
      return res.json(data)
    } catch (e) {
      next(e);
    }
  }
  async changeAttributeValue(req, res, next) {
    try {
      const { newValue } = req.body
      const { id } = req.params
      const attributeValue = await AttributeValue.findOne({ where: { id } })
      const newAttributeValue = await AttributeValue.findOne({ where: { value: newValue } })

      console.log("new: ", newAttributeValue, newValue)

      if (!attributeValue)
        throw ApiError.BadRequest("Значение атрибута не найдено")
      if (newAttributeValue)
        throw ApiError.BadRequest("Такое значение атрибута уже существует")

      const data = await AttributeValue.update({ value: newValue }, { where: { id } })
      return res.json(data)
    } catch (e) {
      next(e);
    }
  }
  async getAttributeValue(req, res, next) {
    try {
      const { value } = req.params
      const attributeValue = await AttributeValue.findOne({ where: { value } })

      if (!attributeValue)
        throw ApiError.BadRequest("Значение атрибута не найдено")

      return res.json(attributeValue)
    } catch (e) {
      next(e);
    }
  }
  async deleteAttributeValue(req, res, next) {
    try {
      const { id } = req.params
      const attributeValue = await AttributeValue.findOne({ where: { id } })

      if (!attributeValue)
        throw ApiError.BadRequest("Значение атрибута не найдено")

      await AttributeValue.destroy({ where: { id } })

      return res.json(attributeValue)
    } catch (e) {
      next(e);
    }
  }
  async getValuesByAttribute(req, res, next) {
    try {
      const { id } = req.params
      const attributeValues = await AttributeValue.findAll({ where: { attributeId: id } })

      if (attributeValues.length === 0)
        throw ApiError.BadRequest("Значения атрибутов не найдены")

      let values = []

      for (let i = 0; i < attributeValues.length; i++)
        values.push(attributeValues[i].value)

      return res.json(values)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new AttributeValueController()