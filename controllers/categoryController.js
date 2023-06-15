const ApiError = require('../exceptions/apiError')
const { Category } = require('../models/models')

class CategoryController {
  async getNameById(req, res, next) {
    try {
      const { id } = req.body
      const { name } = await Category.findOne({ where: { id } })
      return res.json(name)
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CategoryController()