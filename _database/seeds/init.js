const tbl = require('./data/tables')
const branchData = require('./data/branches')
const categoryData = require('./data/categories')
const productData = require('./data/products')
const productBranchData = require('./data/product-branch')


exports.seed = async function(knex, Promise) {
	console.log('** Truncating tables **')
	await knex(tbl.PRODUCT_BRANCH).del()
	await knex(tbl.PRODUCTS).del()
	await knex(tbl.CATEGORIES).del()
	await knex(tbl.BRANCHES).del()
	
	console.log('** Inserting data **')
	await knex(tbl.BRANCHES).insert(branchData)
	await knex(tbl.CATEGORIES).insert(categoryData)
	await knex(tbl.PRODUCTS).insert(productData)
	await knex(tbl.PRODUCT_BRANCH).insert(productBranchData)

}
