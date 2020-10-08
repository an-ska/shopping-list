import React from 'react'
import styles from './Message.module.scss'

const Message = ({  message }) => <h1 className={styles['message']}>{message}</h1>

export default Message
