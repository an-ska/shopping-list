import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button/Button'
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
		<section className={styles['shopping-list-intro']}>
      <h1 className={styles['shopping-list-intro__title']}>{messages.introTitle}</h1>
      <p className={styles['shopping-list-intro__description']}>{messages.introDescription}</p>
      <Button handleClick={createList} icon='list-ul' text={messages.introActionButton} variant="button--full-width" />
		</section>
	)
}

export default ShoppingListIntroduction
