import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Button.module.scss'

const Button = ({  handleClick, icon, text, variant }) => (
	<button className={`${styles.button} ${styles[variant]}`} onClick={handleClick}>
		<FontAwesomeIcon icon={icon} className={styles['button__icon']} />
		{text}
	</button>
)

export default Button
