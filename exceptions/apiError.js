module.exports = class ApiError extends Error {
  status;
  error_code;

  constructor(status, message, error_code) {
    super(message)
    this.status = status
    this.error_code = error_code
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  static BadRequest(message, error_code) {
    return new ApiError(400, message, error_code)
  }
}