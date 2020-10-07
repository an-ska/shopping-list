const mongo = require('mongodb').MongoClient
const express = require('express')
const app = express()
const socketio = require('socket.io')
const http = require('http')
const router = require('./router')
const server = http.createServer(app)
const io = socketio(server, { pingTimeout: 6000000, pingInterval: 30000 })
const messages = require('./messages.json')
const cors = require('cors')
const dotenv = require("dotenv")
const { testDB } = require("./constants")

dotenv.config()

const PORT = process.env.PORT || 5000
const mongoDB = process.env.MONGODB_URI

app.use(router)
app.use(cors())


mongo.connect(mongoDB, (error, client) => {
	if (error) throw error
	console.log(messages.dbConnected)

	let usersNumber = 0;
	const getMessage = usersNumber => (usersNumber > 1 ? `${usersNumber} people are connected!` : `${usersNumber} person connected.`)

	io.on('connect', (socket) => {
		let db = client.db('shoppingListAppDB')
		let shoppingList = db.collection('shoppingList')
		let boughtProductsList = db.collection('boughtProductsList')

		shoppingList
			.find()
			.sort({_id: 1})
			.toArray((error, response) => {
				if (error) throw error
				socket.emit('shoppingList', response)
			})

		boughtProductsList
			.find()
			.sort({_id: 1})
			.toArray((error, response) => {
				if (error) throw error
				socket.emit('boughtProductsList', response)
			})

		socket.on('join', () => {
			usersNumber++
			console.log(messages.newJoiner)

			socket.emit('message',{ text: messages.welcome});
			socket.broadcast.emit('message',{ text: getMessage(usersNumber) })
		})

		socket.on('addProduct', (name, callback) => {
			shoppingList.insertOne({name, isChecked: false, id: Math.random()}, () => {
				io.emit('addedProduct', {name, isChecked: false, id: Math.random()} )
			})

			callback()
		})

		socket.on('markProductAsBought', name => {
			shoppingList.deleteMany({name}, (error, isProductDeleted) => {
				if (error) throw error
				if (isProductDeleted) console.log(messages.productDeleted)

				io.emit('movedProduct', name)
			})

			boughtProductsList.insertOne({name}, () => {
				io.emit('addedBoughtProduct', {name} )
			})
		})

		socket.on('clearShoppingList', () => {
			shoppingList.drop((error, isListDeleted) => {
				if (error) throw error
				if (isListDeleted) console.log(messages.shoppingListDeleted)

				io.emit('clearedShoppingList')
			})
		})

		socket.on('clearBoughtProductsList', () => {
			boughtProductsList.drop((error, isListDeleted) => {
				if (error) throw error
				if (isListDeleted) console.log(messages.boughtProductsListDeleted)

				io.emit('clearedBoughtProductsList')
			})
		})

		socket.on('updateProduct', (oldName, newName, id) => {
			shoppingList.updateOne(
				{name: oldName},
				{$set: {name: newName}},
				(error, isProductUpdated) => {
					if (error) throw error
					if (isProductUpdated) console.log(messages.productUpdated)

					io.emit('editedProduct', newName, id)
			})
		})

		socket.on('deleteProduct', id => {
			shoppingList.deleteOne({id},(error, isProductDeleted) => {
				if (error) throw error
				if (isProductDeleted) console.log(messages.productDeleted)

				io.emit('deletedProduct', id)
			})
		})

		socket.on('disconnect', () => {
			if (usersNumber === 0) return

			usersNumber--
			console.log(messages.userLeft)

			socket.broadcast.emit('message',{ text: getMessage(usersNumber) })
		})
	})
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))
