const userService = require("../service/userService")
const { User, Token, Rating } = require('../models/models')
const ApiError = require("../exceptions/apiError")

class UserController {
  async regin(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.regin(email, password)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (e) {
      next(e);
    }
  }
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
  async update(req, res, next) {
    try {
      const { info } = req.body

      if (!info.firstName.trim() || !info.lastName.trim() || !info.address.trim())
        throw ApiError.BadRequest("Заполните все поля")

      const data = await User.update({
        firstName: info.firstName,
        lastName: info.lastName,
        address: info.address
      }, { where: { id: info.id } })

      return res.json(data)
    } catch (e) {
      next(e)
    }
  }
  async changeRating(req, res, next) {
    try {
      const { userId, productId, value } = req.body
      const rating = await Rating.findOne({ where: { userId, productId } })

      if (!rating) {
        let result = await Rating.create({ userId, productId, rate: value })
        return res.json(result)
      } else {
        rating.set({ rate: value })
        await rating.save()
        return res.json(rating)
      }
    } catch (e) {
      next(e)
    }
  }
  async getRating(req, res, next) {
    try {
      const { userId, productId } = req.params
      const rating = await Rating.findOne({ where: { userId, productId } })

      if (!rating)
        return res.json(0)

      return res.json(rating.rate)
    } catch (e) {
      next(e)
    }
  }
  async getInfo(req, res, next) {
    try {
      const { id } = req.params
      const user = await User.findOne({ where: id })

      if (!user)
        throw ApiError.BadRequest("Пользователь не найден")

      return res.json({ ...user })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()