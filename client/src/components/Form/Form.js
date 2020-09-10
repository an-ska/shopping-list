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
		/>
		<button className="sendButton" onClick={event => addProduct(event)}>Add</button>
	</form>
)

export default Form
