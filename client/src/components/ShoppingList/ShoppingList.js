import React from 'react'
import styles from './ShoppingList.module.scss'
import ReactEmoji from 'react-emoji'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ShoppingList = ({ products, toggleProduct, editProduct, editedProduct, saveOnBlur, saveOnKeyDown, deleteProduct }) => (
	<ul className={styles['shopping-list']} data-cy="shopping-list">
		{ products.map(product => (
			<li key={product.id} className={styles['shopping-list__product']}>
				<input
					className='product-check'
					type='checkbox'
					value={product.name}
					onChange={toggleProduct}
					checked={product.isChecked}
				/>
				{ editedProduct.id === product.id
					?
						<input
							className={styles['product-edition']}
							type='text'
							defaultValue={product.name}
							onBlur={event => saveOnBlur(product.id, event)}
							onKeyDown={event => saveOnKeyDown(product.id, event)}
							autoFocus
						/>
					:
						<>
							<strong className={styles['product-name']} onClick={() => editProduct(product)}>{ReactEmoji.emojify(product.name)}</strong>
							<FontAwesomeIcon icon='trash-alt' onClick={() => deleteProduct(product.id)} className={styles['product-removal']}/>
						</>
				}
			</li>
		)) }
	</ul>
)

export default ShoppingList
