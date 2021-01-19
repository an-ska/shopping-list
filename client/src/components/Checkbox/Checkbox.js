import React from 'react';
import styles from './Checkbox.module.scss';

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
