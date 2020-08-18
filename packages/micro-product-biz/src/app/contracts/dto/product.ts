import * as joi from '@hapi/joi'

import { Translatable, decorators as d } from '@micro-fleet/common'

import {
	ResultResponse, MaybeResponse, GetListRequestBase, DTOListBase,
} from './dto-base'
import { ProductStatus } from '../constants-shared'

// #region RPC Constants

export const MODULE_NAME = 'nabProductManagement'

export enum Action {
	CREATE = 'create',
	EDIT = 'edit',
	HARD_DELETE = 'hardDelete',
	GET_BY_ID = 'getById',
	GET_LIST = 'getList',
	GET_RECALLED_LIST = 'getRecalledList',
}

// #endregion RPC Constants

export const PRODUCT_FIELDS = ['id', 'name', 'price', 'color', 'status', 'categoryId',
	'createdAt', 'updatedAt']
const FIELDS_RULE = { items: joi.string().valid(...PRODUCT_FIELDS) }

export const PRODUCT_RELATIONS = ['branches', 'category']
const RELATIONS_RULE = {
	items: joi
		.string()
		.valid(...PRODUCT_RELATIONS)
		.min(1),
}

// #region Create

export class CreateProductRequest extends Translatable {
	@d.required()
	@d.string({ minLength: 3, maxLength: 100 })
	public readonly name: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

	@d.required()
	@d.number({ min: 0, max: 100e6 })
	public readonly price: number = undefined

	@d.required()
	@d.string({ minLength: 3, maxLength: 50 })
	public readonly color: string = undefined

	@d.required()
	@d.array({
		items: joi.string().regex(/^\d+$/).required(),
		allowSingle: true,
	})
	public readonly branchIds: string[] = undefined

	@d.required()
	@d.bigint()
	public readonly categoryId: string = undefined

	@d.number()
	@d.defaultAs(ProductStatus.ON_SALE)
	@d.valid(ProductStatus.NOT_ON_SALE, ProductStatus.ON_SALE, ProductStatus.RECALLED)
	public readonly status: number = undefined
}

export class CreateProductResponse extends ResultResponse {
	public id: string = undefined
	public createdAt: string = undefined
}

// #endregion Create


// #region Delete

export class DeleteProductRequest extends Translatable {
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

export class DeleteProductResponse extends ResultResponse {
	public ids: string[] = undefined
	public deletedAt: string = undefined
}

// #endregion Delete


// #region Edit

export class EditProductRequest extends Translatable {
	@d.required()
	@d.bigint()
	public readonly id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

	@d.string({ minLength: 3, maxLength: 100 })
	public readonly name?: string = undefined

	@d.number({ min: 0, max: 100e6 })
	public readonly price?: number = undefined

	@d.string({ minLength: 3, maxLength: 50 })
	public readonly color?: string = undefined

	@d.array({
		items: joi.string().regex(/^\d+$/).required(),
		allowSingle: true,
	})
	public readonly branchIds?: string[] = undefined

	@d.bigint()
	public readonly categoryId?: string = undefined

	@d.number()
	@d.valid(ProductStatus.NOT_ON_SALE, ProductStatus.ON_SALE, ProductStatus.RECALLED)
	public readonly status?: string = undefined
}

export class EditProductResponse extends ResultResponse {
	public id: string = undefined
	public updatedAt: string = undefined
}

// #endregion Edit


// #region Get by ID

export class GetProductByIdRequest extends Translatable {
	@d.required()
	@d.bigint()
	public readonly id: string = undefined

	@d.array(FIELDS_RULE)
	public readonly fields?: string[] = undefined

	@d.array(RELATIONS_RULE)
	public readonly relations?: string[] = undefined

	@d.validateProp(joi.object())
	public readonly viewer?: ProductViewer = undefined
}

export type ProductViewer = {
	/**
	 * Only has value when the viewer is a logged-in user.
	 */
	userId?: string,

	/**
	 * Viewer's IP address
	 */
	ipAddress: string,

	/**
	 * Device name (if request is made from mobile app) or user agent string (if from browser)
	 */
	deviceName: string,
}

export class GetSingleProductResponse extends MaybeResponse {
	public id: string = undefined
	public name?: string = undefined
	public price?: number = undefined
	public color?: string = undefined
	public status?: string = undefined
	public categoryId?: any = undefined
	public category?: any = undefined
	public branchIds?: any[] = undefined
	public branches?: any[] = undefined
	public createdAt?: string = undefined
	public updatedAt?: string = undefined
}

// #endregion Get by ID


// #region Get List

export class GetProductListRequest extends GetListRequestBase {
	@d.array(FIELDS_RULE)
	public readonly fields?: string[] = undefined

	@d.array(RELATIONS_RULE)
	public readonly relations?: string[] = undefined

	@d.string({ maxLength: 50 })
	@d.valid('name', 'price', 'createdAt', 'updatedAt')
	public sortBy: string = undefined
}

export class ProductListItem extends Translatable {
	public id: string = undefined
	public name?: string = undefined
	public price?: number = undefined
	public color?: string = undefined
	public status?: string = undefined
	public categoryId?: any = undefined
	public category?: any = undefined
	public branchIds?: any[] = undefined
	public branches?: any[] = undefined
	public createdAt?: string = undefined
	public updatedAt?: string = undefined
}

export class GetProductListResponse extends DTOListBase<ProductListItem> {
	public constructor(products: object[] = [], total: number = 0) {
		super(ProductListItem, products, total)
	}
}

// #endregion Get List
