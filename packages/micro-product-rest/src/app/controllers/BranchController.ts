/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:branch')

import { decorators as cd } from '@micro-fleet/common'
import { decorators as wd, RestControllerBase } from '@micro-fleet/web'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/branch'
import { IBranchService } from '../contracts/interfaces/IBranchService'


@wd.controller('branches')
export default class BranchController extends RestControllerBase {
	constructor(@cd.inject(T.BRANCH_SVC) private _branchSvc: IBranchService) {
		super()
		debug('BranchController instantiated')
	}

	/**
	 * GET {prefix}/branches/:id?fields=prop
	 * @example /api/v1/branches/123654?fields=id&fields=name
	 */
	@wd.GET(':id')
	public getOne(
		@wd.model({
			extractFn: (r) => ({
				id: r.params.id,
				...r.query,
			}),
		})
		params: dto.GetBranchByIdRequest,
	) {
		return this._branchSvc.getById(params)
	}

	/**
	 * GET {prefix}/branches/
	 * @example /api/v1/branches?pageIndex=2&pageSize=10&sortBy=name&sortType=desc
	 */
	@wd.GET('/')
	public getList(
		@wd.model({
			extractFn: (r) => r.query,
		})
		params: dto.GetBranchListRequest,
	) {
		return this._branchSvc.getList(params)
	}

	/**
	 * POST {prefix}/branches
	 * @example /api/v1/branches
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
	public async create(@wd.model() params: dto.CreateBranchRequest) {
		return this._branchSvc.create(params)
	}

	/**
	 * PATCH {prefix}/branches
	 * @example /api/v1/branches
	 *
	 * {
	 *	id: '123498765',
	 *	name: 'Nemo Doe',
	 * }
	 */
	@wd.PATCH('/')
	public edit(@wd.model({ isPartial: true }) params: dto.EditBranchRequest) {
		return this._branchSvc.edit(params)
	}

	/**
	 * DELETE {prefix}/branches/:ids
	 * @example /api/v1/branches/123654
	 */
	@wd.DELETE(':ids')
	public deleteSingle(
	@wd.model({
		extractFn: (r) => r.params,
	})
		params: dto.DeleteBranchRequest,
	) {
		return this._branchSvc.hardDeleteSingle(params)
	}

	/**
	 * DELETE {prefix}/branches
	 * @example /api/v1/branches?ids=123&ids=456&ids=789
	 */
	@wd.DELETE('/')
	public deleteMany(
	@wd.model({
		extractFn: (r) => r.query,
	})
		params: dto.DeleteBranchRequest,
	) {
		return this._branchSvc.hardDeleteMany(params)
	}
}
