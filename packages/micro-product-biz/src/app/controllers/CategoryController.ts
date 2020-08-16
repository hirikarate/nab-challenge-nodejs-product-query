/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:category')

import * as cm from '@micro-fleet/common'

const { inject } = cm.decorators
import { decorators as d } from '@micro-fleet/service-communication'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/category'
import { ICategoryService } from '../contracts/interfaces/ICategoryService'
import { trustPayload } from '../utils/controller-util'

const { Action: A, MODULE_NAME } = dto


@d.mediateController(MODULE_NAME)
export default class CategoryController {
	constructor(@inject(T.CATEGORY_SVC) private _categorySvc: ICategoryService) {
		debug('CategoryController instantiated')
	}

	/*
	 * Topic for all actions here:
	 * `request.{MODULE_NAME}.{Action.NAME}`
	 */

	/**
	 * @example
	 *
	 * Request body for creating a single user:
	 * {
	 *	name: 'John Nemo'
	 * }
	 *
	 * or
	 *
	 * {
	 *	name: 'John Nemo',
	 *	status: 'active'
	 * }
	 */
	@d.action(A.CREATE)
	public create(@trustPayload() request: dto.CreateCategoryRequest): Promise<dto.CreateCategoryResponse> {
		return this._categorySvc.create(request)
	}

	/**
	 * @example
	 *
	 * {
	 *	id: '123498765',
	 *	name: 'Nemo Doe'
	 * }
	 */
	@d.action(A.EDIT)
	public edit(@trustPayload() request: dto.EditCategoryRequest): Promise<dto.EditCategoryResponse> {
		return this._categorySvc.edit(request)
	}

	/**
	 * @example
	 *
	 * {
	 *	id: '123498765'
	 * }
	 */
	@d.action(A.GET_BY_ID)
	public getById(@trustPayload() request: dto.GetCategoryByIdRequest): Promise<dto.GetSingleCategoryResponse> {
		return this._categorySvc.getById(request)
	}

	/**
	 * @example
	 *
	 * {
	 *	pageIndex: 2,
	 *	pageSize: 10,
	 *	sortBy: 'name',
	 *	sortType: 'desc'
	 * }
	 */
	@d.action(A.GET_LIST)
	public getList(@trustPayload() request: dto.GetCategoryListRequest): Promise<dto.GetCategoryListResponse> {
		return this._categorySvc.getList(request)
	}

	/**
	 * @example
	 * {
	 *	ids: ['123', '456', '678'],
	 *	isAtomic: true
	 * }
	 */
	@d.action(A.HARD_DELETE)
	public hardDelete(@trustPayload() request: dto.DeleteCategoryRequest): Promise<dto.DeleteCategoryResponse> {
		return this._categorySvc.hardDeleteMany(request)
	}
}
