import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from  './Button.module.scss'

const Button = ({  handleClick, icon, text }) => (
	<button className={styles['clear-button']} onClick={handleClick}>
		<FontAwesomeIcon icon={icon} className={styles['clear-button__icon']}/>
		{text}
	</button>
)

export default Button
