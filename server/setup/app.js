const express = require('express')
const cors = require('cors')

const apiRouter = require('./routes/api.js')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/', apiRouter)

module.exports = app
