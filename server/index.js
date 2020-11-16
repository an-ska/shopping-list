const mongo = require('mongodb').MongoClient
const router = require('./router')
const messages = require('./messages.json')
const express = require("express")
const app = express()
const socketio = require('socket.io')
const http = require("http")
const server = http.createServer(app)
const io = socketio(server, { pingTimeout: 6000000, pingInterval: 30000 })
const cors = require('cors')
const dotenv = require('dotenv')
const initSocketConnection = require("./socketConnection")

// use to run the server with PORT & mongoDB consts set in .env file as config reads the .env file so process.env has the keys & values defined in there
// dotenv.config()

const PORT = process.env.PORT || 5000
const mongoDB = process.env.MONGODB_URI || testDB

app.use(router)
app.use(cors())

mongo.connect(mongoDB, (error, client) => {
  if (error) throw error
  console.log(messages.dbConnected)
  
  initSocketConnection(io, client)
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))
