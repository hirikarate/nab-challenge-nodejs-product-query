/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:product')

import { cacheable } from '@micro-fleet/cache'
import { decorators as d } from '@micro-fleet/common'
import { Types as sT, IMediateRpcCaller } from '@micro-fleet/service-communication'

import * as dto from '../contracts-product-management/dto/product'
import { IProductService } from '../contracts-product-management/interfaces/IProductService'
import { RemoteServiceBase } from './RemoteServiceBase'


const { Action: A } = dto

export class RemoteProductService extends RemoteServiceBase implements IProductService {
	constructor(@d.inject(sT.MEDIATE_RPC_CALLER) rpcCaller: IMediateRpcCaller) {
		super(dto.MODULE_NAME, rpcCaller)
		debug('RemoteProductService instantiated')
	}

	/**
	 * @see IProductService.create
	 */
	public create(request: dto.CreateProductRequest): Promise<dto.CreateProductResponse> {
		return this.$call(A.CREATE, request, dto.CreateProductResponse)
	}

	/**
	 * @see IProductService.edit
	 */
	public edit(request: dto.EditProductRequest): Promise<dto.EditProductResponse> {
		return this.$call(A.EDIT, request, dto.EditProductResponse)
	}

	/**
	 * @see IProductService.hardDeleteSingle
	 */
	public hardDeleteSingle(request: dto.DeleteProductRequest): Promise<dto.DeleteProductResponse> {
		return this.$call(A.HARD_DELETE, request, dto.DeleteProductResponse)
	}

	/**
	 * @see IProductService.hardDeleteMany
	 */
	public hardDeleteMany(request: dto.DeleteProductRequest): Promise<dto.DeleteProductResponse> {
		return this.$call(A.HARD_DELETE, request, dto.DeleteProductResponse)
	}

	/**
	 * @see IProductService.getById
	 */
	@cacheable({
		cacheKey: 'productSvc:getById',
		duration: 10,
	})
	public getById(request: dto.GetProductByIdRequest): Promise<dto.GetSingleProductResponse> {
		return this.$call(A.GET_BY_ID, request, dto.GetSingleProductResponse)
	}

	/**
	 * @see IProductService.getList
	 */
	@cacheable({
		cacheKey: 'productSvc:getList',
		duration: 10,
	})
	public getList(request: dto.GetProductListRequest): Promise<dto.GetProductListResponse> {
		return this.$call(A.GET_LIST, request, dto.GetProductListResponse)
	}

	/**
	 * @see IProductService.getRecalledList
	 */
	@cacheable({
		cacheKey: 'productSvc:getRecalledList',
		duration: 10,
	})
	public getRecalledList(request: dto.GetProductListRequest): Promise<dto.GetProductListResponse> {
		return this.$call(A.GET_RECALLED_LIST, request, dto.GetProductListResponse)
	}
}
