const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  firstName: { type: DataTypes.STRING, allowNull: true },
  lastName: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING(500) },
  isActivated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  activationLink: { type: DataTypes.STRING }
})

const Role = sequelize.define('role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
})

const UserRoles = sequelize.define('userRoles', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

const BasketProducts = sequelize.define('basketProducts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  count: { type: DataTypes.INTEGER, allowNull: false }
})

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  price: { type: DataTypes.INTEGER, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false, defaultValue: "Д" },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  buy: { type: DataTypes.INTEGER, defaultValue: 0 },
})

const ProductAttributeValues = sequelize.define('productAttributeValues', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  attributeValues: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false }
})

const ProductAttributes = sequelize.define('productAttributes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const ProductImages = sequelize.define('productImages', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  color: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false }
})

const Attribute = sequelize.define('attribute', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
})

const AttributeValue = sequelize.define('attributeValue', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  value: { type: DataTypes.STRING, allowNull: false }
})

const CategoryAttributes = sequelize.define('categoryAttributes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  price: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "Новый" },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  deliveryMethod: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false }
})

const OrderProducts = sequelize.define('orderProducts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  count: { type: DataTypes.INTEGER, allowNull: false }
})

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
})

const SubCategory = sequelize.define('subCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
})

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
})

const Token = sequelize.define('token', {
  refreshToken: { type: DataTypes.STRING(500), allowNull: false }
})

User.hasOne(Basket, { onDelete: "cascade" })
Basket.belongsTo(User)

User.hasOne(Token, { onDelete: "cascade" })
Token.belongsTo(User)

User.hasMany(Rating, { onDelete: "cascade" })
Rating.belongsTo(User)

Category.hasOne(SubCategory)
SubCategory.belongsTo(Category)

User.belongsToMany(Role, { through: UserRoles, onDelete: "cascade" })
Role.belongsToMany(User, { through: UserRoles })

Category.hasMany(Product)
Product.belongsTo(Category)

SubCategory.hasMany(Product, { onDelete: "cascade" })
Product.belongsTo(SubCategory)

Product.hasMany(ProductAttributes, { onDelete: "cascade" })
ProductAttributes.belongsTo(Product)

Attribute.hasMany(ProductAttributes, { onDelete: "cascade" })
ProductAttributes.belongsTo(Attribute)

Attribute.hasMany(AttributeValue, { onDelete: "cascade" })
AttributeValue.belongsTo(Attribute)

Product.hasMany(Rating, { onDelete: "cascade" })
Rating.belongsTo(Product)

Product.hasMany(ProductAttributeValues, { onDelete: "cascade" })
ProductAttributeValues.belongsTo(Product)

Product.hasMany(ProductImages, { onDelete: "cascade" })
ProductImages.belongsTo(Product)

ProductAttributeValues.hasMany(OrderProducts, { onDelete: "cascade" })
OrderProducts.belongsTo(ProductAttributeValues)

User.hasMany(Order)
Order.belongsTo(User)

Order.hasOne(OrderProducts)
OrderProducts.belongsTo(Order)

Basket.hasMany(BasketProducts)
BasketProducts.belongsTo(Basket)

ProductAttributeValues.hasOne(BasketProducts, { onDelete: "cascade" })
BasketProducts.belongsTo(ProductAttributeValues)

module.exports = {
  User, Role, UserRoles, Basket, BasketProducts, Order, OrderProducts, Rating, Product, ProductAttributes, ProductAttributeValues, Attribute, ProductImages, CategoryAttributes, AttributeValue, Category, SubCategory, Token
}