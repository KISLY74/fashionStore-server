const uuid = require('uuid')
const path = require('path')
const fs = require('fs');
const ApiError = require('../exceptions/apiError')

class ImageService {
  async add(file) {
    if (!file)
      throw ApiError.BadRequest("Файл не указан")

    let filename = uuid.v4() + ".jpg"
    file.mv(path.resolve(__dirname, '..', 'static', filename))

    return filename
  }

  async update(file, filename) {
    if (!filename)
      throw ApiError.BadRequest("Имя файла не указано")
    if (!file)
      throw ApiError.BadRequest("Файл не указан")

    this.delete(filename)
    this.add(file)

    return filename
  }

  async delete(filename) {
    if (!filename)
      throw ApiError.BadRequest("Имя файла не указано")

    fs.unlink(path.resolve(__dirname, '..', 'static', filename), err => {
      if (err)
        throw ApiError.BadRequest(err.message);
    })
    return filename;
  }
}

module.exports = new ImageService()