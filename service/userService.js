const { User, UserRoles, Role, Basket } = require('../models/models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('../service/mailService')
const tokenService = require('../service/tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exceptions/apiError')

class UserService {
  async regin(email, password) {
    const candidate = await User.findOne({ where: { email } })
    if (candidate)
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)

    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()

    const user = await User.create({ email, password: hashPassword, activationLink })
    await UserRoles.create({ userId: user.id, roleId: 2 })
    // await Basket.create({ userId: user.id })

    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`)

    const userRole = await UserRoles.findOne({ where: { id: user.id } })
    const { name } = await Role.findOne({ where: { id: userRole.roleId } })

    const userDto = new UserDto(user, name)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto
    }
  }
  async login(email, password) {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с таким email не был найден`, 102)
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль`, 103)
    }

    const userRole = await UserRoles.findOne({ where: { id: user.id } })
    const { name } = await Role.findOne({ where: { id: userRole.roleId } })

    const userDto = new UserDto(user, name)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto
    }
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await User.findOne({ where: { id: userData.id } })
    const userRole = await UserRoles.findOne({ where: { id: user.id } })
    const { name } = await Role.findOne({ where: { id: userRole.roleId } })
    const userDto = new UserDto(user, name)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto
    }
  }
  async activate(activationLink) {
    const user = await User.findOne({ where: { activationLink } })
    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации')
    }
    user.isActivated = true
    await user.save()
  }
  async getAllUsers() {
    const users = await User.findAll()
    return users
  }
}

module.exports = new UserService()