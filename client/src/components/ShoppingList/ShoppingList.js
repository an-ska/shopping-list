import React from 'react'
import './ShoppingList.scss'
import ReactEmoji from 'react-emoji'

const ShoppingList = ({ products, markProductAsBought, editProduct, editedProduct, saveOnBlur, saveOnKeyDown, deleteProduct }) => (
	<ul>
		{ products.map((product, i) => (
			<li key={i}>
				<input
					type='checkbox'
					value={product.name}
					onChange={markProductAsBought}
					checked={product.isChecked}
				/>
				{ editedProduct.id === product.id
					?
						<input
							type='text'
							placeholder={product.name}
							onBlur={(event) => saveOnBlur(product.id, event)}
							onKeyDown={(event) => saveOnKeyDown(product.id, event)}
							autoFocus
						/>
					:
						<>
							<span onClick={() => editProduct(product)}>{ReactEmoji.emojify(product.name)}</span>
							<span onClick={() => deleteProduct(product.id)}>x</span>
						</>
				}
			</li>
		)) }
	</ul>
)

export default ShoppingList
