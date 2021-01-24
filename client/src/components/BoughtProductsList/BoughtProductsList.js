import React from 'react';
import ReactEmoji from 'react-emoji';
import styles from './BoughtProductsList.module.scss';
import Checkbox from '../Checkbox/Checkbox';

const BoughtProductsList = ({ boughtProducts, toggleProduct }) => (
  <ul className={styles['bought-products-list']}>
    {boughtProducts.map(({ id, name }) => (
      <li key={id} className={styles['bought-products-list__product']}>
        <label>
          <Checkbox
            variant='checkbox--small'
            value={name}
            handleChange={({ target: { value } }) => toggleProduct(value)}
            isChecked={true}
          ></Checkbox>
          {ReactEmoji.emojify(name)}
        </label>
      </li>
    ))}
  </ul>
);

export default BoughtProductsList;
