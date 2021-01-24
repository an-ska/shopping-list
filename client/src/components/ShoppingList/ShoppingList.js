import React from 'react';
import styles from './ShoppingList.module.scss';
import ReactEmoji from 'react-emoji';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Checkbox from '../Checkbox/Checkbox';
import Input from '../Input/Input';

const ShoppingList = ({
  products,
  toggleProduct,
  enableProductEdition,
  editProduct,
  editedProduct,
  updateEditedProduct,
  deleteProduct
}) => (
  <ul className={styles['shopping-list']}>
    {products.map(product => (
      <li key={product.id} className={styles['shopping-list__product']}>
        <Checkbox
          value={product.name}
          handleChange={({ target: { value } }) => toggleProduct(value)}
        ></Checkbox>
        {editedProduct.id === product.id ? (
          <Input
            name='input-product--edition'
            value={editedProduct.name}
            handleChange={({ target: { value } }) => editProduct(value)}
            handleBlur={() => updateEditedProduct(product.name)}
            handleKeyDown={event =>
              event.key === 'Enter' && updateEditedProduct(product.name)
            }
          ></Input>
        ) : (
          <>
            <strong
              className={styles['product-name']}
              onClick={() => enableProductEdition(product)}
            >
              {ReactEmoji.emojify(product.name)}
            </strong>
            <FontAwesomeIcon
              icon='trash-alt'
              onClick={() => deleteProduct(product.id)}
              className={styles['product-removal']}
            />
          </>
        )}
      </li>
    ))}
  </ul>
);

export default ShoppingList;
