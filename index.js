require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const app = new express()
const sequelize = require('./db')
const PORT = process.env.PORT
const models = require('./models/models')
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/errorMiddleware')
const path = require('path')

app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()