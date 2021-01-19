import React from 'react';
import styles from './Form.module.scss';
import Button from '../Button/Button';

const Form = ({ setProduct, addProduct, product }) => (
  <form className={styles['form']}>
    <input
      className={styles['form__input']}
      type='text'
      placeholder='Add...'
      value={product}
      onChange={({ target: { value } }) => setProduct(value)}
      onKeyDown={event => event.key === 'Enter' && addProduct(event)}
      autoFocus
      data-cy='add-product-input'
    />
    <Button
      handleClick={event => addProduct(event)}
      icon='plus'
      variant='button--form-add'
    />
  </form>
);

export default Form;
