const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config();
require('./config/config-passport')

const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/api/users')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

const uriDb = process.env.URI_DB


const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "db-contacts"
})

connection
  .then(()=> {
    console.log("Database connected successfully")
  })
  .catch(error => {
    console.log("Couldn't load database", error.message)
    process.exit(1)
  })

app.use('/api/contacts', contactsRouter)
app.use('/api/users', usersRouter)

app.use((req, res) => {
  res.status(404).json({ 
    status: "error",
    code: 404,
    message: 'Use api on routes: /api/contacts' })
})

app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).json({ 
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal server error"
   })
})

module.exports = app
