import React from 'react'

const Button = ({  clearList, text }) => <button className="clearButton" onClick={clearList}>{text}</button>

export default Button
