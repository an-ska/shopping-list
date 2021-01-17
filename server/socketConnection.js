
const messages = require('./messages.json')
const { v4: uuidv4 } = require('uuid')
const constants = require('./constants')

module.exports = (io, client) => {
  let usersNumber = 0
	const getMessage = usersNumber => {
		if (usersNumber > 1) return `${usersNumber} people are connected!`
		if (usersNumber === 1) return `${usersNumber} person connected!`

		return
	} 

	io.on('connect', socket => {
		let db = client.db(constants.PRODUCTION_DB_NAME)
		let userCollection = ''
		let listId

		socket.on('join', id => {
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

			socket.emit('message', { text: messages.welcome })
			socket.to(listId).emit('message', { text: getMessage(usersNumber) })
		})

		socket.on('addProduct', (name, callback) => {
			const id = uuidv4()
			const product = { name, isBought: false, id }
			userCollection.insertOne(product, () => {
				io.to(listId).emit('addedProduct', product)
				socket.emit('message', { text: messages.isAdded })
			})

			callback()
		})

		socket.on('toggleProduct', (name, isBought) => {
			userCollection.updateMany(
				{name},
				{$set: { isBought }},
				(error, isProduct) => {
					if (error) throw error
					if (isProduct) {
						io.to(listId).emit('toggledProduct', name, isBought)
						socket.emit('message', { text: messages.isUnbought })
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
					io.to(listId).emit('clearedShoppingList')
					socket.emit('message', { text: messages.shoppingListDeleted })
				}
			})
		})

		socket.on('clearBoughtProductsList', () => {
			userCollection.deleteMany(
				{isBought: true},
				(error, isListDeleted) => {
				if (error) throw error
				if (isListDeleted) {
					io.to(listId).emit('clearedBoughtProductsList')
					socket.emit('message', { text: messages.boughtProductsListDeleted })
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
						io.to(listId).emit('editedProduct', newName, id)
						socket.emit('message', { text: messages.isUpdated })
					}
			})
		})

		socket.on('deleteProduct', id => {
			userCollection.deleteOne({id}, (error, isProductDeleted) => {
				if (error) throw error
				if (isProductDeleted) {
					io.to(listId).emit('deletedProduct', id)
					socket.emit('message', { text: messages.isDeleted })
				}
			})
		})

		socket.on('disconnect', () => {
			if (usersNumber === 0) return

			usersNumber--
			console.log(messages.userLeft)
			socket.to(listId).emit('message', { text: getMessage(usersNumber) })
		})
  })
}
