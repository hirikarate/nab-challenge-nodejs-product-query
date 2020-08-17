/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:product')

import { decorators as cd } from '@micro-fleet/common'
import { decorators as wd, RestControllerBase } from '@micro-fleet/web'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts-product-search/dto/search'
import { ISearchQueryService } from '../contracts-product-search/interfaces/ISearchQueryService'


@wd.controller('products/search')
export default class ProductSearchController extends RestControllerBase {
	constructor(@cd.inject(T.SEARCH_SVC) private _searchSvc: ISearchQueryService) {
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
			extractFn: (r) => r.query,
		})
		params: dto.FilterRequest,
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
			extractFn: (r) => r.query,
		})
		params: dto.SearchAdvancedRequest,
	) {
		return this._searchSvc.searchAdvanced(params)
	}
}
