const path = require('path')

const copySrc = require('../../../scripts/copySrc')

copySrc([
	{
		from: abs('../../micro-product-biz/src/app/contracts'),
		to: abs('../src/app/contracts-product-management')
	},
	{
		from: abs('../../micro-search-biz/src/app/contracts'),
		to: abs('../src/app/contracts-product-search')
	},
])

function abs(fragment) {
	return path.resolve(__dirname, fragment)
}
