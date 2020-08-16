import * as joi from '@hapi/joi'
import { Translatable, decorators as d } from '@micro-fleet/common'

import { ResultResponse, MaybeResponse } from './dto-base'


// #region RPC Constants

export const MODULE_NAME = 'nabProductSearchEngine'

export enum Action {
	CREATE_INDEX = 'createIndex',
	EDIT_INDEX = 'editIndex',
	HARD_DELETE = 'hardDelete',
	SEARCH_ADVANCED = 'searchAdvanced',
}

// #endregion RPC Constants


// #region Create

export class CreateIndexRequest extends Translatable {
	public readonly name: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
	public readonly price: number = undefined
	public readonly color: string = undefined

	@d.required()
	@d.array({
		items: joi.string().regex(/\d+/).required(),
		allowSingle: true,
	})
	public readonly branchIds?: string[] = undefined

	@d.array({
		items: joi.object(),
		allowSingle: true,
	})
	public readonly branches: any[] = undefined

	public readonly categoryId: string = undefined
	public readonly category: any = undefined
	public readonly status: string = undefined
}

export class CreateIndexResponse extends ResultResponse {
	public createdAt: string = undefined
}

// #endregion Create


// #region Delete

export class DeleteIndexRequest extends Translatable {
	@d.required()
	@d.array({
		items: joi.string().regex(/\d+/).required(),
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
	public readonly id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
	public readonly name?: string = undefined
	public readonly price?: number = undefined
	public readonly color?: string = undefined

	@d.required()
	@d.array({
		items: joi.string().regex(/\d+/).required(),
		allowSingle: true,
	})
	public readonly branchIds?: string[] = undefined

	@d.array({
		items: joi.object(),
		allowSingle: true,
	})
	public readonly branches?: any[] = undefined

	public readonly categoryId: string = undefined
	public readonly category?: any = undefined
	public readonly status?: string = undefined
}

export class EditIndexResponse extends ResultResponse {
	public updatedAt: string = undefined
}

// #endregion Edit


// #region Search advanced

export class SearchAdvancedRequest extends Translatable {
	public readonly name?: string = undefined
	public readonly price?: number = undefined
	public readonly color?: string = undefined

	@d.required()
	@d.array({
		items: joi.string().regex(/\d+/).required(),
		allowSingle: true,
	})
	public readonly branchIds?: string[] = undefined

	@d.array({
		items: joi.object(),
		allowSingle: true,
	})
	public readonly branches?: any[] = undefined

	public readonly categoryId: string = undefined
	public readonly category?: any = undefined
	public readonly status?: string = undefined
}

export class SearchAdvancedResponse extends MaybeResponse {
	public id: string = undefined
	public name?: string = undefined
	public price?: number = undefined
	public color?: string = undefined
	public status?: string = undefined
	public category?: any = undefined
	public branches?: any[] = undefined
	public createdAt?: string = undefined
	public updatedAt?: string = undefined
}

// #endregion Search advanced
