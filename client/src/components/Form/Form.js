import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Form.module.scss'

const Form = ({ setProduct, addProduct, product }) => (
	<form className={styles['form']}>
		<input
			className={styles['form__input']}
			type="text"
			placeholder="Add..."
			value={product}
			onChange={({ target: { value } }) => setProduct(value)}
			onKeyDown={event => event.key === 'Enter' && addProduct(event)}
			autoFocus
			data-cy="add-product-input"
		/>
		<button className={styles['form__button']} onClick={event => addProduct(event)} data-cy="add-button">
			<FontAwesomeIcon icon='plus' />
		</button>
	</form>
)

export default Form
