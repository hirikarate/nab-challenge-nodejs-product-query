const axios = require('axios')

const productData = require('./seeds/data/products')
const productBranchData = require('./seeds/data/product-branch')


function prepareProducts() {
	productBranchData.forEach(pb => {
		const product = productData.find(p => p.id === pb.productId)
		product.branchIds = product.branchIds || []
		product.branchIds.push(pb.branchId)
	})
}

function delay(seconds) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 1000 * seconds)
	})
}

async function submitProducts() {
	for (const product of productData) {
		delete product.id
		delete product.createdAt

		console.log('Creating', product)
		await axios.default.post(
			'http://localhost:3000/api/v1/products',
			product,
		).catch(err => console.dir(err.response))
		// break
		await delay(1)
	}
}

/**
 * Programmatically create products via API so that their search indices are created also
 *
 * @example
 *   node ./create-api.js
 */
(() => {
	prepareProducts()
	submitProducts()
})()