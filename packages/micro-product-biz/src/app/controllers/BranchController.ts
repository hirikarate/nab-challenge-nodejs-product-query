/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:branch')

import * as cm from '@micro-fleet/common'

const { inject } = cm.decorators
import { decorators as d } from '@micro-fleet/service-communication'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/branch'
import { IBranchService } from '../contracts/interfaces/IBranchService'
import { trustPayload } from '../utils/controller-util'

const { Action: A, MODULE_NAME } = dto


@d.mediateController(MODULE_NAME)
export default class BranchController {
	constructor(@inject(T.BRANCH_SVC) private _branchSvc: IBranchService) {
		debug('BranchController instantiated')
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
	public create(@trustPayload() request: dto.CreateBranchRequest): Promise<dto.CreateBranchResponse> {
		return this._branchSvc.create(request)
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
	public edit(@trustPayload() request: dto.EditBranchRequest): Promise<dto.EditBranchResponse> {
		return this._branchSvc.edit(request)
	}

	/**
	 * @example
	 *
	 * {
	 *	id: '123498765'
	 * }
	 */
	@d.action(A.GET_BY_ID)
	public getById(@trustPayload() request: dto.GetBranchByIdRequest): Promise<dto.GetSingleBranchResponse> {
		return this._branchSvc.getById(request)
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
	public getList(@trustPayload() request: dto.GetBranchListRequest): Promise<dto.GetBranchListResponse> {
		return this._branchSvc.getList(request)
	}

	/**
	 * @example
	 * {
	 *	ids: ['123', '456', '678'],
	 *	isAtomic: true
	 * }
	 */
	@d.action(A.HARD_DELETE)
	public hardDelete(@trustPayload() request: dto.DeleteBranchRequest): Promise<dto.DeleteBranchResponse> {
		return this._branchSvc.hardDeleteMany(request)
	}
}
