import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from '../Button/Button'
import styles from './ShoppingListIntroduction.module.scss'
import messages from '../../messages.json'
import { v4 as uuidv4 } from 'uuid'

const ShoppingListIntroduction = () => {
  const history = useHistory()

  const createList = () => {
    const listId = uuidv4()
    history.push(`/app/${listId}`)
  }

	return (
		<section className={styles['shopping-list-introduction']}>
      <Button handleClick={createList} icon='list-ul' text={messages.createList} />
		</section>
	)
}

export default ShoppingListIntroduction
