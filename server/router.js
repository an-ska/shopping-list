const express = require('express')
const router = express.Router()
const messages = require('./messages.json')

module.exports = router.get("/", (req, res) => {
	res.send({ response: messages.serverIsRunning }).status(200)
})
