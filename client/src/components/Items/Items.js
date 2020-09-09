import React from 'react'
import '../Items/Items.scss'
import ReactEmoji from 'react-emoji'

const Items = ({ items, markAsBought }) => (
	<ul>
		{ items.map((item, i) => (
			<li key={i}>
				<input type='checkbox' name={item.item} value={item.item} onChange={markAsBought} checked={item.isChecked} />
				<span suppressContentEditableWarning contentEditable={true}>{ReactEmoji.emojify(item.item)}</span><p>{item.isChecked ? 'yes' : 'no' }</p>
			</li>
		)) }
	</ul>
)

export default Items;
