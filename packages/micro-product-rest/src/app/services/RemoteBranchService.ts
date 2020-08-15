/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:branch')

import { cacheable } from '@micro-fleet/cache'
import { decorators as d } from '@micro-fleet/common'
import { Types as sT, IMediateRpcCaller } from '@micro-fleet/service-communication'

import * as dto from '../contracts/dto/branch'
import { RemoteServiceBase } from './RemoteServiceBase'
import { IBranchService } from '../contracts/interfaces/IBranchService'


const { Action: A } = dto

export class RemoteBranchService extends RemoteServiceBase implements IBranchService {
	constructor(@d.inject(sT.MEDIATE_RPC_CALLER) rpcCaller: IMediateRpcCaller) {
		super(dto.MODULE_NAME, rpcCaller)
		debug('RemoteBranchService instantiated')
	}

	/**
	 * @see IBranchService.create
	 */
	public create(request: dto.CreateBranchRequest): Promise<dto.CreateBranchResponse> {
		return this.$call(A.CREATE, request, dto.CreateBranchResponse)
	}

	/**
	 * @see IBranchService.edit
	 */
	public edit(request: dto.EditBranchRequest): Promise<dto.EditBranchResponse> {
		return this.$call(A.EDIT, request, dto.EditBranchResponse)
	}

	/**
	 * @see IBranchService.hardDeleteSingle
	 */
	public hardDeleteSingle(request: dto.DeleteBranchRequest): Promise<dto.DeleteBranchResponse> {
		return this.$call(A.HARD_DELETE, request, dto.DeleteBranchResponse)
	}

	/**
	 * @see IBranchService.hardDeleteMany
	 */
	public hardDeleteMany(request: dto.DeleteBranchRequest): Promise<dto.DeleteBranchResponse> {
		return this.$call(A.HARD_DELETE, request, dto.DeleteBranchResponse)
	}

	/**
	 * @see IBranchService.getById
	 */
	@cacheable({
		cacheKey: 'branchSvc:getById',
		duration: 10,
	})
	public getById(request: dto.GetBranchByIdRequest): Promise<dto.GetSingleBranchResponse> {
		return this.$call(A.GET_BY_ID, request, dto.GetSingleBranchResponse)
	}

	/**
	 * @see IBranchService.getList
	 */
	@cacheable({
		cacheKey: 'branchSvc:getList',
		duration: 10,
	})
	public getList(request: dto.GetBranchListRequest): Promise<dto.GetBranchListResponse> {
		return this.$call(A.GET_LIST, request, dto.GetBranchListResponse)
	}
}
