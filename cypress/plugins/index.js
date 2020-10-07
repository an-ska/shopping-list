const { testDB } = require("../../constants")
const seeder = require('cypress-mongo-seeder')

const folder = './cypress/fixtures'
const dropCollections = true

module.exports = on => {
	on('task', {
		'seed:database': () => seeder.seedAll(testDB, folder, dropCollections)
	})
}
