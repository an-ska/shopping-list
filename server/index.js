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
const dotenv = require('dotenv')
const { v4: uuidv4 } = require('uuid')

// use to run the server with PORT and mongoDB set in env file
// dotenv.config()

const PORT = process.env.PORT || 5000
const mongoDB = process.env.MONGODB_URI || testDB

app.use(router)
app.use(cors())

mongo.connect(mongoDB, (error, client) => {
	if (error) throw error
	console.log(messages.dbConnected)

	let usersNumber = 0
	const getMessage = usersNumber => {
		if (usersNumber > 1) {
			return `${usersNumber} people are connected!`
		}
		if (usersNumber === 1) {
			`${usersNumber} person connected!`
		}

		return
	} 

	io.on('connect', (socket) => {
		let db = client.db('shoppingListAppDB')
		let userCollection
		let listId

		socket.on('join', (id) => {
			listId = id
			userCollection = db.collection(listId)

			userCollection
			.find()
			.sort({_id: 1})
			.toArray((error, response) => {
				if (error) throw error
				socket.emit('products', response)
			})

			usersNumber++
			console.log(messages.newJoiner)

			socket.join(listId)

			socket.emit('message', { text: messages.welcome})
			socket.broadcast.to(listId).emit('message', { text: getMessage(usersNumber) })
		})

		socket.on('addProduct', (name, callback) => {
			const id = uuidv4()
			userCollection.insertOne({name, isBought: false, isChecked: false, id}, () => {
				io.to(listId).emit('addedProduct', {name, isBought: false, isChecked: false, id} )
			})

			callback()
		})

		socket.on('markProductAsBought', name => {
			userCollection.updateMany(
				{name},
				{$set: {isBought: true}},
				(error, isProductBought) => {
					if (error) throw error
					if (isProductBought) {
						console.log(messages.isBought)
						io.to(listId).emit('markedProductAsBought', name)
						socket.emit('message', { text: getMessage(messages.isBought) })
					}
				}
			)
		})

		socket.on('clearShoppingList', () => {
			userCollection.deleteMany(
				{isBought: false},
				(error, isListDeleted) => {
				if (error) throw error
				if (isListDeleted) {
					console.log(messages.shoppingListDeleted)
					io.to(listId).emit('clearedShoppingList')
				}
			})
		})

		socket.on('clearBoughtProductsList', () => {
			userCollection.deleteMany(
				{isBought: true},
				(error, isListDeleted) => {
				if (error) throw error
				if (isListDeleted) {
					console.log(messages.boughtProductsListDeleted)
					io.to(listId).emit('clearedBoughtProductsList')
				}
			})
		})

		socket.on('updateProduct', (oldName, newName, id) => {
			userCollection.updateOne(
				{name: oldName},
				{$set: {name: newName}},
				(error, isProductUpdated) => {
					if (error) throw error
					if (isProductUpdated) {
						console.log(messages.productUpdated)
						io.to(listId).emit('editedProduct', newName, id)
					}
			})
		})

		socket.on('deleteProduct', id => {
			userCollection.deleteOne({id}, (error, isProductDeleted) => {
				if (error) throw error
				if (isProductDeleted) {
					console.log(messages.productDeleted)
					io.to(listId).emit('deletedProduct', id)
				}
			})
		})

		socket.on('disconnect', () => {
			if (usersNumber === 0) return

			usersNumber--
			console.log(messages.userLeft)

			socket.broadcast.to(listId).emit('message', { text: getMessage(usersNumber) })
		})
	})
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))
