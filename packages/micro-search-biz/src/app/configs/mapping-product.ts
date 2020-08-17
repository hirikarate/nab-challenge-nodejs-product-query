import { RequestParams } from '@elastic/elasticsearch'

import Indices from '../constants/Indices'


export default [
	{
		index: Indices.PRODUCTS,
		body: {
			properties: {
				name: { type: 'text' },
				price: { type: 'double' },
				color: { type: 'text' },
				status: { type: 'keyword' },
				branchIds: { type: 'long' },
				branches: { type: 'object' },
				categoryId: { type: 'long' },
				category: { type: 'object' },
			},
		},
	},
] as RequestParams.IndicesPutMapping[]
