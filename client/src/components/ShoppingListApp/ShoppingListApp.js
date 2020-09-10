import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import BoughtProductsList from '../BoughtProductsList/BoughtProductsList'
import Form from '../Form/Form'
import ShoppingList from '../ShoppingList/ShoppingList'
import Button from '../Button/Button'
import Message from '../Message/Message'
import messages from '../../messages.json'

let socket
const ShoppingListApp = () => {
	const [message, setMessage] = useState()
	const [product, setProduct] = useState('')
	const [products, setProducts] = useState([])
	const [boughtProducts, setBoughtProducts] = useState([])
	const [editedProduct, setEditedProduct] = useState({})

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

		socket.on('shoppingList', products => { setProducts(products) })

		socket.on('boughtProductsList', products => { setBoughtProducts(products) })

		socket.on('addedProduct', product => { setProducts(products => [...products, product]) })

		socket.on('addedBoughtProduct', product => { setBoughtProducts(products => [...products, product]) })

		socket.on('movedProduct', productName => {
			setMessage(messages.isBought)
			setProducts(products => products.filter(product => product.name !== productName))
		})

		socket.on('clearedShoppingList', () => {
			setMessage(messages.shoppingListCleared)
			setProducts([])
		})

		socket.on('clearedBoughtProductsList', () => {
			setMessage(messages.boughtProductsListCleared)
			setBoughtProducts([])
		})

		socket.on('editedProduct', (newName, id) => {
			setProducts(products => {
				const editedProduct = products.find(product => product.id === id)
				editedProduct.name = newName

				return [...products]
			})
		})

		socket.on('deletedProduct', id => { setProducts(products => products.filter(product => product.id !== id)) })
	},[])


	const addProduct= event => {
		event.preventDefault()

		if (product) { socket.emit('addProduct', product, () => setProduct('')) }
	}

	const clearShoppingList = () => { socket.emit('clearShoppingList') }

	const clearBoughtProductsList = () => { socket.emit('clearBoughtProductsList') }

	const markProductAsBought = event => {
		const boughtProductName = event.target.value

		const updatedProducts = [...products]
		const selectedProducts = updatedProducts.filter(product => product.name === boughtProductName)

		selectedProducts.forEach(selectedProduct => selectedProduct.isChecked = !selectedProduct.isChecked)
		setProducts(updatedProducts)

		setTimeout(() => { socket.emit('markProductAsBought', boughtProductName) }, 800)
	}

	const editProduct = product => { setEditedProduct({...product}) }

	const saveEditedProduct = (id, event) => {
		const editedProduct = [...products].find(product => product.id === id)

		const oldName = editedProduct.name
		const newName = event.target.value

		if (newName) { socket.emit('updateProduct', oldName, newName, id) }

		setEditedProduct({})
	}

	const saveOnBlur = (editedProductId, event) => { saveEditedProduct(editedProductId, event) }

	const saveOnKeyDown = (editedProductId, event) => {
		if (event.key === 'Enter') { saveEditedProduct(editedProductId, event) }
	}

	const deleteProduct = id => { socket.emit('deleteProduct', id)}

	return (
		<>
			<h1>SHOPPING LIST</h1>
			<Button clearList={clearShoppingList} text={messages.clearShoppingList} />
			<Button clearList={clearBoughtProductsList} text={messages.clearBoughtProductsList} />
			<Message message={message} />
			<ShoppingList
				products={products}
				markProductAsBought={markProductAsBought}
				editProduct={editProduct}
				editedProduct={editedProduct}
				saveOnBlur={saveOnBlur}
				saveOnKeyDown={saveOnKeyDown}
				deleteProduct={deleteProduct}
			/>
			<Form product={product} setProduct={setProduct} addProduct={addProduct} />
			<BoughtProductsList boughtProducts={boughtProducts} />
		</>
	)
}

export default ShoppingListApp
