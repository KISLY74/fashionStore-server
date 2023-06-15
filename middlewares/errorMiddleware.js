const ApiError = require('../exceptions/apiError')

module.exports = function (err, req, res, next) {
  console.log(err)
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, error_code: err.error_code })
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка' })
}