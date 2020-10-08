import React from 'react'
import ReactDOM from 'react-dom'
import ShoppingListApp from "./components/ShoppingListApp/ShoppingListApp"
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faTrashAlt,
	faBroom,
	faPlus,
	faCheckSquare
} from '@fortawesome/free-solid-svg-icons';

library.add(
	faTrashAlt,
	faBroom,
	faPlus,
	faCheckSquare
);

ReactDOM.render(<ShoppingListApp />, document.querySelector('#root'))

