import React from 'react'
import ReactEmoji from "react-emoji"

const BoughtItemsList = ({ boughtItems }) => (
	<ul>
		{ boughtItems.map((item, i) => (
			<li key={i} className="boughtItem">{ReactEmoji.emojify(item.item)}</li>
		)) }
	</ul>
)

export default  BoughtItemsList
