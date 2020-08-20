import * as joi from '@hapi/joi'

import { Translatable, decorators as d } from '@micro-fleet/common'

import {
	ResultResponse, MaybeResponse, GetListRequestBase, DTOListBase,
} from './dto-base'


// #region RPC Constants

export const MODULE_NAME = 'nabCategoryManagement'

export enum Action {
	CREATE = 'create',
	EDIT = 'edit',
	EXISTS = 'exists',
	HARD_DELETE = 'hardDelete',
	GET_BY_ID = 'getById',
	GET_LIST = 'getList',
	GET_RECALLED_LIST = 'getRecalledList',
}

// #endregion RPC Constants

const CATEGORY_FIELDS = ['id', 'name', 'createdAt', 'updatedAt']
const FIELDS_RULE = { items: joi.string().valid(...CATEGORY_FIELDS) }


// #region Create

export class CreateCategoryRequest extends Translatable {
	@d.required()
	@d.string({ minLength: 3, maxLength: 100 })
	public readonly name: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
}

export class CreateCategoryResponse extends ResultResponse {
	public id: string = undefined
	public createdAt: string = undefined
}

// #endregion Create


// #region Delete

export class DeleteCategoryRequest extends Translatable {
	@d.required()
	@d.array({
		items: joi.string().regex(/^\d+$/).required(),
		allowSingle: true,
		maxLength: 10,
	})
	public readonly ids: string[] = undefined

	/**
	 * If `true`, when failed to delete one ID, the whole operation is
	 * considered failure, all changes are rolled back.
	 */
	@d.defaultAs(true)
	@d.boolean()
	public readonly isAtomic: boolean = undefined
}

export class DeleteCategoryResponse extends ResultResponse {
	public deletedAt: string = undefined
}

// #endregion Delete


// #region Edit

export class EditCategoryRequest extends Translatable {
	@d.required()
	@d.bigint()
	public readonly id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

	@d.string({ minLength: 3, maxLength: 100 })
	public readonly name?: string = undefined
}

export class EditCategoryResponse extends ResultResponse {
	public updatedAt: string = undefined
}

// #endregion Edit


// #region Check existing

export class CheckCategoryExistingRequest extends Translatable {
	@d.bigint()
	public readonly id?: string = undefined

	@d.string({ minLength: 3, maxLength: 100 })
	public readonly name?: string = undefined
}

export class CheckCategoryExistingResponse extends ResultResponse {
	public isExisting: boolean = undefined
}

// #endregion Check existing


// #region Get by ID

export class GetCategoryByIdRequest extends Translatable {
	@d.required()
	@d.bigint()
	public readonly id: string = undefined

	@d.array(FIELDS_RULE)
	public readonly fields?: string[] = undefined
}

export class GetSingleCategoryResponse extends MaybeResponse {
	public id: string = undefined
	public name?: string = undefined
	public createdAt?: string = undefined
	public updatedAt?: string = undefined
}

// #endregion Get by ID


// #region Get List

export class GetCategoryListRequest extends GetListRequestBase {
	@d.array(FIELDS_RULE)
	public readonly fields?: string[] = undefined

	@d.string({ maxLength: 50 })
	@d.valid('name', 'createdAt', 'updatedAt')
	public sortBy: string = undefined
}

export class CategoryListItem extends Translatable {
	public id: string = undefined
	public name?: string = undefined
	public createdAt?: string = undefined
	public updatedAt?: string = undefined
}

export class GetCategoryListResponse extends DTOListBase<CategoryListItem> {
	public constructor(products: object[] = [], total: number = 0) {
		super(CategoryListItem, products, total)
	}
}

// #endregion Get List
