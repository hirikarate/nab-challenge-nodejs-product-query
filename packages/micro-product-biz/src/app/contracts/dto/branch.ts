import * as joi from '@hapi/joi'

import { Translatable, decorators as d } from '@micro-fleet/common'

import {
	ResultResponse, MaybeResponse, GetListRequestBase, DTOListBase,
} from './dto-base'


// #region RPC Constants

export const MODULE_NAME = 'nabBranchManagement'

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

const BRANCH_FIELDS = ['id', 'name', 'createdAt', 'updatedAt']
const FIELDS_RULE = { items: joi.string().valid(...BRANCH_FIELDS) }


// #region Create

export class CreateBranchRequest extends Translatable {
	@d.required()
	@d.string({ minLength: 3, maxLength: 100 })
	public readonly name: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
}

export class CreateBranchResponse extends ResultResponse {
	public id: string = undefined
	public createdAt: string = undefined
}

// #endregion Create


// #region Delete

export class DeleteBranchRequest extends Translatable {
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

export class DeleteBranchResponse extends ResultResponse {
	public deletedAt: string = undefined
}

// #endregion Delete


// #region Edit

export class EditBranchRequest extends Translatable {
	@d.required()
	@d.bigint()
	public readonly id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

	@d.string({ minLength: 3, maxLength: 100 })
	public readonly name?: string = undefined
}

export class EditBranchResponse extends ResultResponse {
	public updatedAt: string = undefined
}

// #endregion Edit


// #region Check existing

export class CheckBranchExistingRequest extends Translatable {
	@d.bigint()
	public readonly id?: string = undefined

	@d.string({ minLength: 3, maxLength: 100 })
	public readonly name?: string = undefined
}

export class CheckBranchExistingResponse extends ResultResponse {
	public isExisting: boolean = undefined
}

// #endregion Check existing


// #region Get by ID

export class GetBranchByIdRequest extends Translatable {
	@d.required()
	@d.bigint()
	public readonly id: string = undefined

	@d.array(FIELDS_RULE)
	public readonly fields?: string[] = undefined
}

export class GetSingleBranchResponse extends MaybeResponse {
	public id: string = undefined
	public name?: string = undefined
	public createdAt?: string = undefined
	public updatedAt?: string = undefined
}

// #endregion Get by ID


// #region Get List

export class GetBranchListRequest extends GetListRequestBase {
	@d.array(FIELDS_RULE)
	public readonly fields?: string[] = undefined

	@d.string({ maxLength: 50 })
	@d.valid('name', 'createdAt', 'updatedAt')
	public sortBy: string = undefined
}

export class BranchListItem extends Translatable {
	public id: string = undefined
	public name?: string = undefined
	public createdAt?: string = undefined
	public updatedAt?: string = undefined
}

export class GetBranchListResponse extends DTOListBase<BranchListItem> {
	public constructor(products: object[] = [], total: number = 0) {
		super(BranchListItem, products, total)
	}
}

// #endregion Get List
