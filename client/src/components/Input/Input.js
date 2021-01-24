import React from 'react';
import styles from './Input.module.scss';
import PropTypes from 'prop-types';

const Input = ({
  name,
  placeholder,
  value,
  handleChange,
  handleBlur,
  handleKeyDown,
}) => (
  <input
    type='text'
    className={`${styles['input-product']} ${styles[name]}`}
    placeholder={placeholder}
    value={value}
    onChange={handleChange}
    onBlur={handleBlur}
    onKeyDown={handleKeyDown}
    autoFocus
  ></input>
);

export default Input;

Input.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any.isRequired,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleKeyDown: PropTypes.func,
};
