/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:product')

import { decorators as cd } from '@micro-fleet/common'
import { decorators as wd, RestControllerBase } from '@micro-fleet/web'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts-product-management/dto/product'
import { IProductService } from '../contracts-product-management/interfaces/IProductService'
import { authorized } from '../filters/authorized'


@authorized()
@wd.controller('products')
export default class ProductController extends RestControllerBase {
	constructor(
		@cd.inject(T.PRODUCT_DIRECT_SVC) private _productDirectSvc: IProductService,
		@cd.inject(T.PRODUCT_MEDIATE_SVC) private _productMediateSvc: IProductService,
	) {
		super()
		debug('ProductController instantiated')
	}

	/**
	 * GET {prefix}/products/:id?fields=prop
	 * @example /api/v1/products/123654?fields=id&fields=name
	 */
	@wd.GET(':id')
	public getOne(
		@wd.model({
			extractFn: (r) => ({
				id: r.params.id,
				...r.query,
			}),
		})
		params: dto.GetProductByIdRequest,
	) {
		return this._productMediateSvc.getById(params)
	}

	/**
	 * GET {prefix}/products/
	 * @example /api/v1/products?pageIndex=2&pageSize=10&sortBy=name&sortType=desc
	 */
	@wd.GET('/')
	public getList(
		@wd.model({
			extractFn: (r) => r.query,
		})
		params: dto.GetProductListRequest,
	) {
		return this._productDirectSvc.getList(params)
	}

	/**
	 * POST {prefix}/products
	 * @example /api/v1/products
	 *
	 */
	@wd.POST('/')
	public async create(@wd.model() params: dto.CreateProductRequest) {
		return this._productMediateSvc.create(params)
	}

	/**
	 * PATCH {prefix}/products
	 * @example /api/v1/products
	 */
	@wd.PATCH('/')
	public edit(@wd.model({ isPartial: true }) params: dto.EditProductRequest) {
		return this._productMediateSvc.edit(params)
	}

	/**
	 * DELETE {prefix}/products/:ids
	 * @example /api/v1/products/123654
	 */
	@wd.DELETE(':ids')
	public deleteSingle(
		@wd.model({
			extractFn: (r) => r.params,
		})
		params: dto.DeleteProductRequest,
	) {
		return this._productMediateSvc.hardDeleteSingle(params)
	}

	/**
	 * DELETE {prefix}/products
	 * @example /api/v1/products?ids=123&ids=456&ids=789
	 */
	@wd.DELETE('/')
	public deleteMany(
		@wd.model({
			extractFn: (r) => r.query,
		})
		params: dto.DeleteProductRequest,
	) {
		return this._productMediateSvc.hardDeleteMany(params)
	}
}
