/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:category')

import { decorators as cd } from '@micro-fleet/common'
import { decorators as wd, RestControllerBase } from '@micro-fleet/web'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts-product-management/dto/category'
import { ICategoryService } from '../contracts-product-management/interfaces/ICategoryService'


@wd.controller('categories')
export default class CategoryController extends RestControllerBase {
	constructor(
		@cd.inject(T.CATEGORY_SVC) private _categorySvc: ICategoryService,
	) {
		super()
		debug('CategoryController instantiated')
	}

	/**
	 * GET {prefix}/categories/:id?fields=prop
	 * @example /api/v1/categories/123654?fields=id&fields=name
	 */
	@wd.GET(':id')
	public getOne(
		@wd.model({
			extractFn: (r) => ({
				id: r.params.id,
				...r.query,
			}),
		})
		params: dto.GetCategoryByIdRequest,
	) {
		return this._categorySvc.getById(params)
	}

	/**
	 * GET {prefix}/categories/
	 * @example /api/v1/categories?pageIndex=2&pageSize=10&sortBy=name&sortType=desc
	 */
	@wd.GET('/')
	public getList(
		@wd.model({
			extractFn: (r) => r.query,
		})
		params: dto.GetCategoryListRequest,
	) {
		return this._categorySvc.getList(params)
	}

	/**
	 * POST {prefix}/categories
	 * @example /api/v1/categories
	 *
	 * Request body for creating a single user:
	 * {
	 *	name: 'John Nemo',
	 * }
	 *
	 * or
	 *
	 * {
	 *	name: 'John Nemo',
	 *	status: 'active',
	 * }
	 */
	@wd.POST('/')
	public async create(@wd.model() params: dto.CreateCategoryRequest) {
		return this._categorySvc.create(params)
	}

	/**
	 * PATCH {prefix}/categories
	 * @example /api/v1/categories
	 *
	 * {
	 *	id: '123498765',
	 *	name: 'Nemo Doe',
	 * }
	 */
	@wd.PATCH('/')
	public edit(@wd.model({ isPartial: true }) params: dto.EditCategoryRequest) {
		return this._categorySvc.edit(params)
	}

	/**
	 * DELETE {prefix}/categories/:ids
	 * @example /api/v1/categories/123654
	 */
	@wd.DELETE(':ids')
	public deleteSingle(
	@wd.model({
		extractFn: (r) => r.params,
	})
		params: dto.DeleteCategoryRequest,
	) {
		return this._categorySvc.hardDeleteSingle(params)
	}

	/**
	 * DELETE {prefix}/categories
	 * @example /api/v1/categories?ids=123&ids=456&ids=789
	 */
	@wd.DELETE('/')
	public deleteMany(
	@wd.model({
		extractFn: (r) => r.query,
	})
		params: dto.DeleteCategoryRequest,
	) {
		return this._categorySvc.hardDeleteMany(params)
	}
}
