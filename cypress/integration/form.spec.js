describe('Form', () => {
	before(() => {
		cy.task('seed:database')
		cy.visit('/')
	})

	it('focuses input on load', () => {
		cy.focused()
			.should('have.attr', 'data-cy','add-product-input')
	})

	// it('add item', () => {
	// 	cy.get('[data-cy="shopping-list"] li').should('have.length', 3)
	// 	cy.get('[data-cy="add-product-input"]').type('Hello, World')
	// 	cy.get('[data-cy="add-button"]').click()
	//
	// 	cy.get('[data-cy="shopping-list"] li').should('have.length', 4)
	// })

	it('marks as bought', () => {
		const productsNo = cy.get('[data-cy="shopping-list"] li').length
		Cypress.log(productsNo)
		const product = cy.get('[data-cy="shopping-list"] li input').first()
		product.click()
		cy.get('[data-cy="shopping-list"] li').should('have.length', 2)
	})
})
