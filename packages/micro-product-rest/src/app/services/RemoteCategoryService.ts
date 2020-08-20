/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:category')

import { cacheable } from '@micro-fleet/cache'
import { decorators as d } from '@micro-fleet/common'
import { Types as sT, IMediateRpcCaller } from '@micro-fleet/service-communication'

import * as dto from '../contracts-product-management/dto/category'
import { ICategoryService } from '../contracts-product-management/interfaces/ICategoryService'
import { RemoteServiceBase } from './RemoteServiceBase'


const { Action: A } = dto

export class RemoteCategoryService extends RemoteServiceBase implements ICategoryService {
	constructor(@d.inject(sT.MEDIATE_RPC_CALLER) rpcCaller: IMediateRpcCaller) {
		super(dto.MODULE_NAME, rpcCaller)
		debug('RemoteCategoryService instantiated')
	}

	/**
	 * @see ICategoryService.create
	 */
	public create(request: dto.CreateCategoryRequest): Promise<dto.CreateCategoryResponse> {
		return this.$call(A.CREATE, request, dto.CreateCategoryResponse)
	}

	/**
	 * @see ICategoryService.edit
	 */
	public edit(request: dto.EditCategoryRequest): Promise<dto.EditCategoryResponse> {
		return this.$call(A.EDIT, request, dto.EditCategoryResponse)
	}

	/**
	 * @see ICategoryService.exists
	 */
	public exists(request: dto.CheckCategoryExistingRequest): Promise<dto.CheckCategoryExistingResponse> {
		return this.$call(A.EXISTS, request, dto.CheckCategoryExistingResponse)
	}

	/**
	 * @see ICategoryService.hardDeleteSingle
	 */
	public hardDeleteSingle(request: dto.DeleteCategoryRequest): Promise<dto.DeleteCategoryResponse> {
		return this.$call(A.HARD_DELETE, request, dto.DeleteCategoryResponse)
	}

	/**
	 * @see ICategoryService.hardDeleteMany
	 */
	public hardDeleteMany(request: dto.DeleteCategoryRequest): Promise<dto.DeleteCategoryResponse> {
		return this.$call(A.HARD_DELETE, request, dto.DeleteCategoryResponse)
	}

	/**
	 * @see ICategoryService.getById
	 */
	@cacheable({
		cacheKey: 'categorySvc:getById',
		duration: 10,
	})
	public getById(request: dto.GetCategoryByIdRequest): Promise<dto.GetSingleCategoryResponse> {
		return this.$call(A.GET_BY_ID, request, dto.GetSingleCategoryResponse)
	}

	/**
	 * @see ICategoryService.getList
	 */
	@cacheable({
		cacheKey: 'categorySvc:getList',
		duration: 10,
	})
	public getList(request: dto.GetCategoryListRequest): Promise<dto.GetCategoryListResponse> {
		return this.$call(A.GET_LIST, request, dto.GetCategoryListResponse)
	}
}
