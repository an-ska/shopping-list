import React from 'react';
import styles from './Form.module.scss';
import Button from '../Button/Button';
import Input from '../Input/Input';

const Form = ({ setProduct, addProduct, product }) => (
  <form className={styles['form']}>
    <Input
      name='input-product--addition'
      placeholder='Add...'
      value={product}
      handleChange={({ target: { value } }) => setProduct(value)}
      handleKeyDown={event => event.key === 'Enter' && addProduct(event)}
    ></Input>
    <Button
      handleClick={event => addProduct(event)}
      icon='plus'
      variant='button--form-add'
    />
  </form>
);

export default Form;
