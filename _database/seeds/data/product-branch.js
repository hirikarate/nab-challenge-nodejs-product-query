const branches = require('./branches')
const products = require('./products')


module.exports = [
	...products.reduce((mappings, p, i) => {
		mappings.push({
			productId: p.id,
			branchId: branches[i%2].id,
		})

		// In every 3 products, there is one with 2 branches
		if (i % 3 === 0) {
			mappings.push({
				productId: p.id,
				branchId: branches[i%2 ? 0 : 1].id,
			})
		}
		return mappings
	}, [])
]
