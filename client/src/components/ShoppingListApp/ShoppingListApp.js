import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import BoughtItemsList from '../ BoughtItemsList/BoughtItemsList'
import Form from '../Form/Form'
import ShoppingList from '../ShoppingList/ShoppingList'
import Button from '../Button/Button'
import Message from '../Message/Message'

let socket
const ShoppingListApp = () => {
	const [message, setMessage] = useState()
	const [item, setItem] = useState('')
	const [items, setItems] = useState([])
	const [boughtItems, setBoughtItems] = useState([])
	const [editedItem, setEditedItem] = useState({})

	const ENDPOINT = 'localhost:5000'

	useEffect(() => {
		socket = io(ENDPOINT)

		socket.emit('join')

		return () => {
			socket.emit('disconnect')
			socket.off()
		}
	}, [])

	useEffect(() => {
		socket.on('message', message => { setMessage(message.text) })

		socket.on('shoppingList', items => {
			setItems(items)
		})

		socket.on('boughtItemsList', items => {
			setBoughtItems(items)
		})

		socket.on('item', item => {
			setItems(items => [...items, item])
		})

		socket.on('boughtItem', item => {
			setBoughtItems(items => [...items, item])
		})

		socket.on('movedItem', movedItem => {
			setMessage('Item is bought')
			setItems(items => items.filter(item => item.item !== movedItem.item))
		})

		socket.on('clearedShoppingList', () => {
			setMessage('Shopping list was cleared')
			setItems([])
		})

		socket.on('clearedBoughtItemsList', () => {
			setMessage('Bought items list was cleared')
			setBoughtItems([])
		})

		socket.on('editedItem', (newValue, editedItemId) => {
			setItems(items => {
				const editedItemm = items.find(item => item.id === editedItemId)
				editedItemm.item = newValue

				return [...items]
			})
		})

		socket.on('deletedItem', id => {
			setItems(items => items.filter(item => item.id !== id))
		})
	},[])


	const addItem = event => {
		event.preventDefault()

		if (item) {
			socket.emit('addItem', item, () => setItem(''))
		}
	}

	const clearShoppingList = () => {
		socket.emit('clearShoppingList')
	}

	const clearBoughtItemsList = () => {
		socket.emit('clearBoughtItemsList')
	}

	const markAsBought = event => {
		const boughtItem = event.target.value

		const updatedItems = [...items]
		const selectedItems = updatedItems.filter(item => item.item === boughtItem)

		selectedItems.forEach(selectedItem => selectedItem.isChecked = !selectedItem.isChecked)
		setItems(updatedItems)

		setTimeout(() => { socket.emit('markAsBought', boughtItem) }, 800)
	}

	const editItem = item => { setEditedItem({...item}) }

	const saveEdit = (editedItem, event) => {
		const updatedItems = [...items]
		const editedItemm = updatedItems.find(item => item.id === editedItem.id)

		const oldValue = editedItemm.item
		const newValue = event.target.value
		const editedItemId = editedItemm.id

		if (newValue) { socket.emit('updateItem', oldValue, newValue, editedItemId) }

		setEditedItem({})
	}

	const saveOnBlur = (editedItem, event) => {
		saveEdit(editedItem, event)
	}

	const saveOnKeyDown = (editedItem, event) => {
		if (event.keyCode === 13) {
			saveEdit(editedItem, event)
		}
	}

	const deleteItem = id => { socket.emit('deleteItem', id)}

	return (
		<>
			<h1>LISTA ZAKUPÓW</h1>
			<Button clearList={clearShoppingList} text="CLEAR SHOPPING LIST" />
			<Button clearList={clearBoughtItemsList} text="CLEAR BOUGHT ITEMS LIST" />
			<Message message={message} />
			<ShoppingList
				items={items}
				markAsBought={markAsBought}
				editItem={editItem}
				editedItem={editedItem}
				saveOnBlur={saveOnBlur}
				saveOnKeyDown={saveOnKeyDown}
				deleteItem={deleteItem}
			/>
			<Form item={item} setItem={setItem} addItem={addItem} />
			<BoughtItemsList boughtItems={boughtItems} />
		</>
	)
}

export default ShoppingListApp
