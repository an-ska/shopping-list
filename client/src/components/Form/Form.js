import React from 'react';
import styles from './Form.module.scss';
import Button from '../Button/Button';
import Input from '../Input/Input';
import PropTypes from 'prop-types';

const Form = ({ setProduct, addProduct, productName }) => (
  <form className={styles['form']}>
    <Input
      name='input-product--addition'
      placeholder='Add...'
      value={productName}
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

Form.propTypes = {
  setProduct: PropTypes.func.isRequired,
  addProduct: PropTypes.func.isRequired,
  productName: PropTypes.string.isRequired,
};
