import { RequestParams } from '@elastic/elasticsearch'

import Indices from '../constants/Indices'


export default [
	{
		index: Indices.PRODUCT_FILTER,
		body: {
			properties: {
				name: { type: 'text' },
				price: { type: 'double' },
				color: { type: 'keyword' },
				status: { type: 'keyword' },
				branchIds: { type: 'long' },
				branches: { type: 'object' },
				categoryId: { type: 'long' },
				category: { type: 'object' },
			},
		},
	},
	{
		index: Indices.PRODUCT_SEARCH,
		body: {
			properties: {
				name: { type: 'text' },
				price: { type: 'double' },
				color: { type: 'text' }, // color supports full text index
				status: { type: 'keyword' },
				branchIds: { type: 'long' },
				branches: { type: 'object' },
				categoryId: { type: 'long' },
				category: { type: 'object' },
			},
		},
	},
] as RequestParams.IndicesPutMapping[]
