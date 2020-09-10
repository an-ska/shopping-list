import React from 'react'
import '../Items/Items.scss'
import ReactEmoji from 'react-emoji'

const Items = ({ items, markAsBought, editItem, editedItem, saveOnBlur, saveOnKeyDown, deleteItem }) => (
	<ul>
		{ items.map((item, i) => (
			<li key={i}>
				<input type='checkbox' name={item.item} value={item.item} onChange={markAsBought} checked={item.isChecked} />
				{ editedItem.id === item.id
					? <input
						type='text'
						placeholder={item.item}
						onBlur={(event) => saveOnBlur(item, event)}
						onKeyDown={(event) => saveOnKeyDown(item, event)}
						autoFocus
					/>
					:
					<>
						<span onClick={() => editItem(item)}>{ReactEmoji.emojify(item.item)}</span>
						<span onClick={() => deleteItem(item.id)}>x</span>
					</>
				}
			</li>
		)) }
	</ul>
)

export default Items;
