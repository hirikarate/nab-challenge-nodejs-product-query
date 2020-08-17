/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:product')

import * as cm from '@micro-fleet/common'

const { inject } = cm.decorators
import { decorators as d } from '@micro-fleet/service-communication'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/product'
import { IProductService } from '../contracts/interfaces/IProductService'
import { trustPayload } from '../utils/controller-util'

const { Action: A, MODULE_NAME } = dto


/**
 * Listens to message broker and handles requests for product operations.
 */
@d.mediateController(MODULE_NAME)
@d.directController(MODULE_NAME)
export default class ProductController {
	constructor(@inject(T.PRODUCT_SVC) private _productSvc: IProductService) {
		debug('ProductController instantiated')
	}

	/*
	 * Topic for all actions here:
	 * `request.{MODULE_NAME}.{Action.NAME}`
	 */


	@d.action(A.CREATE)
	public create(@trustPayload() request: dto.CreateProductRequest): Promise<dto.CreateProductResponse> {
		return this._productSvc.create(request)
	}

	@d.action(A.EDIT)
	public edit(@trustPayload() request: dto.EditProductRequest): Promise<dto.EditProductResponse> {
		return this._productSvc.edit(request)
	}

	@d.action(A.GET_BY_ID)
	public getById(@trustPayload() request: dto.GetProductByIdRequest): Promise<dto.GetSingleProductResponse> {
		return this._productSvc.getById(request)
	}

	@d.action(A.GET_LIST)
	public getList(@trustPayload() request: dto.GetProductListRequest): Promise<dto.GetProductListResponse> {
		return this._productSvc.getList(request)
	}

	@d.action(A.GET_RECALLED_LIST)
	public getRecalledList(@trustPayload() request: dto.GetProductListRequest): Promise<dto.GetProductListResponse> {
		return this._productSvc.getRecalledList(request)
	}

	@d.action(A.HARD_DELETE)
	public hardDelete(@trustPayload() request: dto.DeleteProductRequest): Promise<dto.DeleteProductResponse> {
		return this._productSvc.hardDeleteMany(request)
	}
}
