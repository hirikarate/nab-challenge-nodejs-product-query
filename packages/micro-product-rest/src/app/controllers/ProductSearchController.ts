/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:product')

import { decorators as cd } from '@micro-fleet/common'
import {
	decorators as wd,
	RestControllerBase,
	Request,
} from '@micro-fleet/web'

import { Types as T } from '../constants/Types'
import * as sdto from '../contracts-product-search/dto/search'
import * as pdto from '../contracts-product-management/dto/product'
import { ISearchQueryService } from '../contracts-product-search/interfaces/ISearchQueryService'
import { IProductService } from '../contracts-product-management/interfaces/IProductService'


@wd.controller('products/search')
export default class ProductSearchController extends RestControllerBase {
	constructor(
		@cd.inject(T.SEARCH_SVC) private _searchSvc: ISearchQueryService,
		@cd.inject(T.PRODUCT_MEDIATE_SVC) private _productSvc: IProductService,
	) {
		super()
		debug('ProductSearchController instantiated')
	}

	/**
	 * GET {prefix}/products/search
	 * @example /api/v1/products/search?
	 */
	@wd.GET('/filter')
	public filter(
		@wd.model({
			extractFn: (r) => ({
				...r.query,
				viewer: buildViewerObject(r),
			}),
		})
		params: sdto.FilterRequest,
	) {
		return this._searchSvc.filter(params)
	}

	/**
	 * GET {prefix}/products/search
	 * @example /api/v1/products/search?
	 */
	@wd.GET('/advanced')
	public searchAdvanced(
		@wd.model({
			extractFn: (r) => ({
				...r.query,
				viewer: buildViewerObject(r),
			}),
		})
		params: sdto.SearchAdvancedRequest,
	) {
		return this._searchSvc.searchAdvanced(params)
	}

	/**
	 * GET {prefix}/products/:id?fields=prop
	 * @example /api/v1/products/123654?fields=id&fields=name
	 */
	@wd.GET(':id')
	public getOne(
		@wd.model({
			extractFn: (r) => ({
				...r.query,
				id: r.params.id,
				viewer: buildViewerObject(r),
			}),
		})
		params: pdto.GetProductByIdRequest,
	) {
		return this._productSvc.getById(params)
	}

}


const buildViewerObject = (httpRequest: Request) => ({
	ipAddress: (httpRequest.headers['x-forwarded-for'] as string) || httpRequest.connection.remoteAddress,
	deviceName: httpRequest.headers['user-agent'],
	userId: httpRequest.extras['user']?.id,
} as pdto.ProductViewer)
