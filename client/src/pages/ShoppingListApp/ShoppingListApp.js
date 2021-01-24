/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import BoughtProductsList from '../../components/BoughtProductsList/BoughtProductsList';
import Form from '../../components/Form/Form';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import Button from '../../components/Button/Button';
import Message from '../../components/Message/Message';
import messages from '../../messages.json';
import styles from './ShoppingListApp.module.scss';
import PropTypes from 'prop-types';
import {
  ENDPOINT_BACKEND_DEVELOPMENT,
  ENDPOINT_BACKEND_PRODUCTION,
  CHECKED_PRODUCT_ON_SHOPPPING_LIST_TIME,
} from '../../constants';

let socket;
const ShoppingListApp = ({ match }) => {
  const [message, setMessage] = useState('');
  const [productName, setProductName] = useState('');
  const [editedProduct, setEditedProduct] = useState({});
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    socket = io(ENDPOINT_BACKEND_PRODUCTION);
    const { id } = match.params;
    socket.emit('join', id);

    return () => {
      socket.disconnect();
    };
  }, [match.params]);

  useEffect(() => {
    socket.on('message', message => {
      setMessage(message.text);
    });

    socket.on('products', products => {
      setProductList(products);
    });

    socket.on('addedProduct', product => {
      setProductList(products => [...products, product]);
    });

    socket.on('toggledProduct', (name, isBought) => {
      setProductList(products =>
        products.map(product =>
          product.name === name ? { ...product, isBought } : product
        )
      );
    });

    socket.on('clearedShoppingList', () => {
      setProductList(products =>
        products.filter(({ isBought }) => isBought === true)
      );
    });

    socket.on('clearedBoughtProductsList', () => {
      setProductList(products =>
        products.filter(({ isBought }) => isBought === false)
      );
    });

    socket.on('editedProduct', (name, id) => {
      setProductList(products =>
        products.map(product =>
          product.id === id ? { ...product, name } : product
        )
      );
    });

    socket.on('deletedProduct', id => {
      setProductList(products => products.filter(product => product.id !== id));
    });
  }, []);

  const addProduct = event => {
    event.preventDefault();

    if (productName) {
      socket.emit('addProduct', productName, () => setProductName(''));
    }
  };

  const clearShoppingList = () => {
    socket.emit('clearShoppingList');
  };

  const clearBoughtProductsList = () => {
    socket.emit('clearBoughtProductsList');
  };

  const toggleProduct = name => {
    const toggledProducts = [...productList].filter(
      product => product.name === name
    );

    setTimeout(() => {
      socket.emit('toggleProduct', name, !toggledProducts[0].isBought);
    }, CHECKED_PRODUCT_ON_SHOPPPING_LIST_TIME);
  };

  const enableProductEdition = product => {
    setEditedProduct({ ...product });
  };

  const editProduct = name => {
    setEditedProduct(product => ({ ...product, name }));
  };

  const updateEditedProduct = oldName => {
    const { name: newName, id } = editedProduct;

    if (newName) {
      socket.emit('updateProduct', oldName, newName, id);
    }

    setEditedProduct({});
  };

  const deleteProduct = id => {
    socket.emit('deleteProduct', id);
  };

  const shoppingList = productList.filter(({ isBought }) => isBought === false);

  const boughtProductsList = productList.filter(
    ({ isBought }) => isBought === true
  );

  return (
    <section className={styles['shopping-list-app']}>
      <div className={styles['shopping-list-app__header']}>
        {productList.length > 0 && (
          <div className={styles['buttons-panel']}>
            {shoppingList.length > 0 && (
              <Button
                handleClick={clearShoppingList}
                icon='broom'
                text={messages.shoppingList}
                variant='button--half-width'
              />
            )}
            {boughtProductsList.length > 0 && (
              <Button
                handleClick={clearBoughtProductsList}
                icon='broom'
                text={messages.boughtProductsList}
                variant='button--half-width'
              />
            )}
          </div>
        )}
        <Message message={message} />
        <Form
          productName={productName}
          setProduct={setProductName}
          addProduct={addProduct}
        />
      </div>
      {shoppingList.length > 0 && (
        <ShoppingList
          products={shoppingList}
          toggleProduct={toggleProduct}
          enableProductEdition={enableProductEdition}
          editedProduct={editedProduct}
          editProduct={editProduct}
          updateEditedProduct={updateEditedProduct}
          deleteProduct={deleteProduct}
        />
      )}
      {boughtProductsList.length > 0 && (
        <BoughtProductsList
          boughtProducts={boughtProductsList}
          toggleProduct={toggleProduct}
        />
      )}
    </section>
  );
};

export default ShoppingListApp;

ShoppingListApp.prototype = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};
