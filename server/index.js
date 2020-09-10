const mongo = require('mongodb').MongoClient
const express = require('express')
const app = express()
const socketio = require('socket.io')
const http = require('http')
const router = require('./router')
const server = http.createServer(app)
const io = socketio(server, {pingTimeout: 6000000, pingInterval: 30000 })

const PORT = process.env.PORT || 5000

app.use(router);

mongo.connect('mongodb://127.0.0.1//mongoshoppinglist', (error, client) => {
	if (error) throw error

	console.log("Mongodb connected!")

	let usersNo = 0;
	const getMessage = usersNo => (usersNo > 1 ? `${usersNo} people are connected!` : `${usersNo} person connected.`)

	io.on('connect', (socket) => {
		let db = client.db('shoppingListApp')
		let shoppingList = db.collection('shoppingList')
		let boughtItemsList = db.collection('boughtItemsList')

		shoppingList
			.find()
			.sort({_id: 1})
			.toArray((error, response) => {
				if (error) throw error
				socket.emit('shoppingList', response)
			})

		boughtItemsList
			.find()
			.sort({_id: 1})
			.toArray((error, response) => {
				if (error) throw error
				socket.emit('boughtItemsList', response)
			})

		socket.on('join', () => {
			usersNo++
			console.log('We have a new joiner!')

			socket.emit('message',{ text: 'Hey, welcome!'});
			socket.broadcast.emit('message',{ text: getMessage(usersNo) })
		})

		socket.on('addItem', (item, callback) => {
			shoppingList.insertOne({item, isChecked: false, id: Math.random()}, () => {
				io.emit('item', {item, isChecked: false, id: Math.random()} )
			})

			callback()
		})

		socket.on('markAsBought', item => {
			shoppingList.deleteMany({item}, (error, isDeleted) => {
				if (error) throw error
				if (isDeleted) console.log("Item deleted")

				io.emit('movedItem', {item})
			})

			boughtItemsList.insertOne({item}, () => {
				io.emit('boughtItem', {item} )
			})
		})

		socket.on('clearShoppingList', () => {
			shoppingList.drop((error, isDeleted) => {
				if (error) throw error
				if (isDeleted) console.log("Collection deleted")

				io.emit('clearedShoppingList')
			})
		})

		socket.on('clearBoughtItemsList', () => {
			boughtItemsList.drop((error, isDeleted) => {
				if (error) throw error
				if (isDeleted) console.log("Collection deleted")

				io.emit('clearedBoughtItemsList')
			})
		})

		socket.on('updateItem', (oldValue, newValue, editedItemId) => {
			shoppingList.updateOne({item: oldValue}, {$set: {item: newValue}}, (error, isUpdated) => {
				if (error) throw error
				if (isUpdated) console.log("Updated")

				io.emit('editedItem', newValue, editedItemId)
			})
		})

		socket.on('deleteItem', id => {
			shoppingList.dropIndex(id,(error, isDeleted) => {
				if (error) throw error
				if (isDeleted) console.log("Item deleted")

				io.emit('deletedItem', id)
			})
		})

		socket.on('disconnect', () => {
			if (usersNo === 0) return

			usersNo--
			console.log('User has left!')

			socket.broadcast.emit('message',{ text: getMessage(usersNo) })
		})
	})
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))
