import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Form from '../Form/Form'
import Items from '../Items/Items'
import Button from '../Button/Button'

let socket
const ShoppingList = () => {
	const [message, setMessage] = useState()
	const [item, setItem] = useState('')
	const [items, setItems] = useState([])
	const [boughtItems, setBoughtItems] = useState([])

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

		socket.on('cleared', () => {
			setMessage('Shopping list was cleared')
			setItems([])
		})
	},[])


	const addItem = event => {
		event.preventDefault()

		if (item) {
			socket.emit('addItem', item, () => setItem(''))
		}
	}

	const clearShoppingList = () => {
		socket.emit('clear')
	}

	const markAsBought = event => {
		const boughtItem = event.target.value
		//
		const updatedItems = [...items]
		const selectedItems = updatedItems.filter(item => item.item === boughtItem)
		//
		selectedItems.forEach(selectedItem => selectedItem.isChecked = !selectedItem.isChecked)
		setItems(updatedItems)
		//
		setTimeout(() => { socket.emit('markAsBought', boughtItem) }, 800)
		// socket.emit('markAsBought', boughtItem)
	}

	return (
		<>
			<h1>LISTA ZAKUPÓW</h1>
			<Button clearShoppingList={clearShoppingList}/>
			<p>{message}</p>
			<Items items={items} markAsBought={markAsBought} />
			<Form item={item} setItem={setItem} addItem={addItem} />
			{boughtItems.map((item, i) => (
				<p key={i}>{item.item}</p>
			))}
		</>
	)
}

export default  ShoppingList
