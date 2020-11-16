const express = require('express')
const router = express.Router()
const messages = require('./messages.json')

router.get("/", (req, res) => {
	res.send({ response: messages.serverIsRunning }).status(200)
})
module.exports = router