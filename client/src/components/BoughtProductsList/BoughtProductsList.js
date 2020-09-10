import React from 'react'
import ReactEmoji from "react-emoji"

const BoughtProductsList = ({ boughtProducts }) => (
	<ul>
		{ boughtProducts.map((product, i) => (
			<li key={i} className="boughtProduct">{ReactEmoji.emojify(product.name)}</li>
		)) }
	</ul>
)

export default  BoughtProductsList
