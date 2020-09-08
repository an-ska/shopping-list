import React from 'react'

const Form = ({ setItem, addItem, item }) => {
	return (
		<form className="form">
			<input
				className="input"
				type="text"
				placeholder="Add..."
				value={item}
				onChange={({ target: { value } }) => setItem(value)}
				onKeyPress={event => event.key === 'Enter' ? addItem(event) : null}
			/>
			<button className="sendButton" onClick={event => addItem(event)}>Add</button>
		</form>
	)
}

export default Form
