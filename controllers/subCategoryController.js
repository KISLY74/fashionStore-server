const ApiError = require('../exceptions/apiError')
const { SubCategory, Category } = require('../models/models')

class SubCategoryController {
  async addSubCategory(req, res, next) {
    try {
      const { name, categoryName } = req.body
      const subcategory = await SubCategory.findOne({ where: { name } })
      const category = await Category.findOne({ where: { name: categoryName } })

      if (subcategory)
        throw new ApiError(400, "Такое имя подкатегории уже существует")
      if (!category)
        throw new ApiError(400, "Категория не найдена")

      const data = await SubCategory.create({ name, categoryId: category.id })
      return res.json(data)
    } catch (e) {
      next(e);
    }
  }
  async changeSubCategory(req, res, next) {
    try {
      const { newName } = req.body
      const { id } = req.params
      const subCategory = await SubCategory.findOne({ where: { id } })
      const newSubCategory = await SubCategory.findOne({ where: { name: newName } })
      const result = await SubCategory.update({ name: newName }, { where: { id } })

      if (!subCategory)
        throw new ApiError(400, "Подкатегория не найдена")
      if (newSubCategory)
        throw new ApiError(400, "Такая подкатегория уже существует")

      return res.json(result)
    } catch (e) {
      next(e);
    }
  }
  async getSubCategory(req, res, next) {
    try {
      const { name } = req.params
      console.log(JSON.stringify(req.params))
      const subCategory = await SubCategory.findOne({ where: { name } })

      if (!subCategory)
        throw new ApiError(400, "Подкатегория не найдена")

      return res.json(subCategory)
    } catch (e) {
      next(e);
    }
  }
  async deleteSubCategory(req, res, next) {
    try {
      const { id } = req.params
      const subCategory = await SubCategory.findOne({ where: { id } })

      if (!subCategory)
        throw new ApiError(400, "Подкатегория не найдена")

      await SubCategory.destroy({ where: { id } })

      return res.json(subCategory)
    } catch (e) {
      next(e);
    }
  }
  async getAllByCategoryName(req, res, next) {
    try {
      const { categoryName } = req.params
      const category = await Category.findOne({ where: { name: categoryName } })
      const subCategories = await SubCategory.findAll({ where: { categoryId: category.id } })

      if (categoryName === "Все")
        return res.json([])

      if (subCategories.length === 0)
        throw new ApiError(400, "Подкатегории не найдены")

      return res.json(subCategories)
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new SubCategoryController()