import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { routes } from './routes.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
	faTrashAlt,
	faBroom,
	faPlus,
	faCheckSquare,
	faListUl
} from '@fortawesome/free-solid-svg-icons'

library.add(
	faTrashAlt,
	faBroom,
	faPlus,
	faCheckSquare,
	faListUl
)

ReactDOM.render(
	<Router>{routes}</Router>, document.querySelector('#root'))
