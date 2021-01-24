import React from 'react';
import styles from './Message.module.scss';
import PropTypes from 'prop-types';

const Message = ({ message }) => (
  <h1 className={styles['message']}>{message}</h1>
);

export default Message;

Message.propTypes = {
  message: PropTypes.string.isRequired,
};
