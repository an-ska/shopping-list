import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import BoughtProductsList from '../../components/BoughtProductsList/BoughtProductsList';
import Form from '../../components/Form/Form';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import Button from '../../components/Button/Button';
import Message from '../../components/Message/Message';
import messages from '../../messages.json';
import styles from './ShoppingListApp.module.scss';
import {
  ENDPOINT_BACKEND_DEVELOPMENT,
  ENDPOINT_BACKEND_PRODUCTION,
  CHECKED_PRODUCT_ON_SHOPPPING_LIST_TIME,
} from '../../constants';

let socket;
const ShoppingListApp = ({ match }) => {
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState('');
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
      setProductList(products => {
        products
          .filter(product => product.name === name)
          .forEach(product => (product.isBought = isBought));

        return [...products];
      });
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

    socket.on('editedProduct', (newName, id) => {
      setProductList(products => {
        const editedProduct = products.find(product => product.id === id);
        editedProduct.name = newName;

        return [...products];
      });
    });

    socket.on('deletedProduct', id => {
      setProductList(products => products.filter(product => product.id !== id));
    });
  }, []);

  const addProduct = event => {
    event.preventDefault();

    if (product) {
      socket.emit('addProduct', product, () => setProduct(''));
    }
  };

  const clearShoppingList = () => {
    socket.emit('clearShoppingList');
  };

  const clearBoughtProductsList = () => {
    socket.emit('clearBoughtProductsList');
  };

  const toggleProduct = event => {
    const productName = event.target.value;

    const toggledProducts = [...productList].filter(
      ({ name }) => name === productName
    );

    setTimeout(() => {
      socket.emit('toggleProduct', productName, !toggledProducts[0].isBought);
    }, CHECKED_PRODUCT_ON_SHOPPPING_LIST_TIME);
  };

  const editProduct = product => {
    setEditedProduct({ ...product });
  };

  const saveEditedProduct = (id, event) => {
    const editedProduct = [...productList].find(product => product.id === id);

    const oldName = editedProduct.name;
    const newName = event.target.value;

    if (newName) {
      socket.emit('updateProduct', oldName, newName, id);
    }

    setEditedProduct({});
  };

  const saveOnBlur = (editedProductId, event) => {
    saveEditedProduct(editedProductId, event);
  };

  const saveOnKeyDown = (editedProductId, event) => {
    if (event.key === 'Enter') {
      saveEditedProduct(editedProductId, event);
    }
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
          product={product}
          setProduct={setProduct}
          addProduct={addProduct}
        />
      </div>
      {shoppingList.length > 0 && (
        <ShoppingList
          products={shoppingList}
          toggleProduct={toggleProduct}
          editProduct={editProduct}
          editedProduct={editedProduct}
          saveOnBlur={saveOnBlur}
          saveOnKeyDown={saveOnKeyDown}
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
