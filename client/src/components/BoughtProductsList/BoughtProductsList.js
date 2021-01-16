import React from 'react';
import ReactEmoji from 'react-emoji';
import styles from './BoughtProductsList.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BoughtProductsList = ({ boughtProducts, toggleProduct }) => (
  <ul className={styles['bought-products-list']}>
    {boughtProducts.map((product, i) => (
      <li key={i} className={styles['bought-products-list__product']}>
        <input
          className='product-check product-check--small'
          type='checkbox'
          value={product.name}
          onChange={toggleProduct}
          checked={product.isChecked}
        />
        {ReactEmoji.emojify(product.name)}
      </li>
    ))}
  </ul>
);

export default BoughtProductsList;
