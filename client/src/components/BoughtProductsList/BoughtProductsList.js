import React from 'react'
import ReactEmoji from "react-emoji"
import styles from './BoughtProductsList.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const BoughtProductsList = ({ boughtProducts }) => (
	<ul className={styles['bought-products-list']}>
		{ boughtProducts.map((product, i) => (
			<li key={i} className={styles['bought-products-list__product']}>
				<FontAwesomeIcon icon='check-square' className={styles['bought-product__check']} />
				{ReactEmoji.emojify(product.name)}
			</li>
		)) }
	</ul>
)

export default  BoughtProductsList
