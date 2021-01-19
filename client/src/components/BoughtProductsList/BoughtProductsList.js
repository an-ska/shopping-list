import React from 'react';
import ReactEmoji from 'react-emoji';
import styles from './BoughtProductsList.module.scss';
import Checkbox from '../Checkbox/Checkbox';

const BoughtProductsList = ({ boughtProducts, toggleProduct }) => (
  <ul className={styles['bought-products-list']}>
    {boughtProducts.map((product, i) => (
      <li key={i} className={styles['bought-products-list__product']}>
        <label>
          <Checkbox
            variant='checkbox--small'
            value={product.name}
            handleChange={toggleProduct}
            isChecked={true}
          ></Checkbox>
          {ReactEmoji.emojify(product.name)}
        </label>
      </li>
    ))}
  </ul>
);

export default BoughtProductsList;
