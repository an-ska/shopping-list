import React from 'react';
import styles from './Checkbox.module.scss';
import PropTypes from 'prop-types';

const Checkbox = ({ handleChange, value, variant, isChecked }) => (
  <input
    type='checkbox'
    className={`${styles.checkbox} ${styles[variant]}`}
    value={value}
    onChange={handleChange}
    checked={isChecked}
  ></input>
);

export default Checkbox;

Checkbox.propTypes = {
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  variant: PropTypes.string,
  isChecked: PropTypes.bool,
};
