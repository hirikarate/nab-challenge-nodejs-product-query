import * as joi from '@hapi/joi'
import { Translatable, decorators as d } from '@micro-fleet/common'

import { ResultResponse, DTOListBase } from './dto-base'


// #region RPC Constants

export const MODULE_NAME = 'nabProductSearchEngine'

export enum Action {
	CREATE_INDEX = 'createIndex',
	EDIT_INDEX = 'editIndex',
	HARD_DELETE = 'hardDelete',
	FILTER = 'filter',
	SEARCH_ADVANCED = 'searchAdvanced',
}

// #endregion RPC Constants


// #region Create

export class CreateIndexRequest extends Translatable {
	@d.string()
	public readonly id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

	@d.string()
	public readonly name: string = undefined

	@d.number()
	public readonly price: number = undefined

	@d.string()
	public readonly color: string = undefined

	@d.array({
		items: joi.string().regex(/^\d+$/).required(),
		allowSingle: true,
	})
	public readonly branchIds?: string[] = undefined

	@d.array({
		items: joi.object(),
		allowSingle: true,
	})
	public readonly branches: any[] = undefined

	@d.string()
	public readonly categoryId: string = undefined

	@d.validateProp(joi.object())
	public readonly category: any = undefined

	@d.number()
	public readonly status: number = undefined
}

export class CreateIndexResponse extends ResultResponse {
	public createdAt: string = undefined
}

// #endregion Create


// #region Delete

export class DeleteIndexRequest extends Translatable {
	@d.required()
	@d.array({
		items: joi.string().regex(/^\d+$/).required(),
		allowSingle: true,
		maxLength: 10,
	})
	public readonly ids: string[] = undefined
}

export class DeleteIndexResponse extends ResultResponse {
	public deletedAt: string = undefined
}

// #endregion Delete


// #region Edit

export class EditIndexRequest extends Translatable {
	@d.required()
	@d.string()
	public readonly id?: string = undefined

	@d.string()
	public readonly name?: string = undefined

	@d.number()
	public readonly price?: number = undefined

	@d.string()
	public readonly color?: string = undefined

	@d.array({
		items: joi.string().regex(/^\d+$/).required(),
		allowSingle: true,
	})
	public readonly branchIds?: string[] = undefined

	@d.array({
		items: joi.object(),
		allowSingle: true,
	})
	public readonly branches?: any[] = undefined

	@d.string()
	public readonly categoryId?: string = undefined

	@d.validateProp(joi.object())
	public readonly category?: any = undefined

	@d.number()
	public readonly status?: number = undefined
}

export class EditIndexResponse extends ResultResponse {
	public updatedAt: string = undefined
}

// #endregion Edit


// #region Search

export class FilterRequest extends Translatable {

	@d.string()
	public readonly name?: string = undefined

	@d.number()
	public readonly maxPrice?: number = undefined

	@d.number()
	public readonly minPrice?: number = undefined

	@d.string()
	public readonly color?: string = undefined

	@d.array({
		items: joi.string().regex(/^\d+$/).required(),
		allowSingle: true,
	})
	public readonly branchIds?: string[] = undefined

	@d.array({
		items: joi.string().required(),
		allowSingle: true,
	})
	public readonly categoryIds?: string[] = undefined

	@d.number()
	public readonly status?: string = undefined

	@d.validateProp(joi.object())
	public readonly viewer?: SearchViewer = undefined
}

export class SearchAdvancedRequest extends Translatable {

	@d.required()
	@d.string()
	public readonly keywords: string = undefined

	@d.number()
	public readonly maxPrice?: number = undefined

	@d.number()
	public readonly minPrice?: number = undefined

	@d.array({
		items: joi.string().regex(/^\d+$/).required(),
		allowSingle: true,
	})
	public readonly branchIds?: string[] = undefined

	@d.array({
		items: joi.string().required(),
		allowSingle: true,
	})
	public readonly categoryIds?: string = undefined

	@d.number()
	public readonly status?: string = undefined

	@d.validateProp(joi.object())
	public readonly viewer?: SearchViewer = undefined
}

export type SearchViewer = {
	/**
	 * Only has value when the viewer is a logged-in user.
	 */
	userId?: string,

	/**
	 * Viewer's IP address or a comma-separated list of IPs
	 * (In case this service is behind proxy/-ies)
	 */
	ipAddress: string,

	/**
	 * Device name (if request is made from mobile app) or user agent string (if from browser)
	 */
	deviceName: string,
}

export class SearchResultItem extends Translatable {
	public id?: string = undefined
	public name?: string = undefined
	public price?: number = undefined
	public color?: string = undefined
	public status?: string = undefined
	public category?: any = undefined
	public branches?: any[] = undefined
	public createdAt?: string = undefined
	public updatedAt?: string = undefined
}

export class SearchResponse extends DTOListBase<SearchResultItem> {
	public constructor(items: object[] = [], total: number = 0) {
		super(SearchResultItem, items, total)
	}
}


// #endregion Search
