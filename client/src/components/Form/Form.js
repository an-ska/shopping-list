import React from 'react'

const Form = ({ setProduct, addProduct, product }) => (
	<form className="form">
		<input
			className="input"
			type="text"
			placeholder="Add..."
			value={product}
			onChange={({ target: { value } }) => setProduct(value)}
			onKeyDown={event => event.key === 'Enter' && addProduct(event)}
			autoFocus
			data-cy="add-product-input"
		/>
		<button className="addButton" onClick={event => addProduct(event)} data-cy="add-button">Add</button>
	</form>
)

export default Form
