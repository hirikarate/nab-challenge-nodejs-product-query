/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:product')

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
	 * @see IProductService.getById
	 */
	public getById(request: dto.GetProductByIdRequest): Promise<dto.GetSingleProductResponse> {
		return this.$call(A.GET_BY_ID, request, dto.GetSingleProductResponse)
	}


	// #region Not implemented

	/**
	 * @see IProductService.create
	 */
	public create(_request: dto.CreateProductRequest): Promise<dto.CreateProductResponse> {
		return Promise.resolve(null)
	}

	/**
	 * @see IProductService.edit
	 */
	public edit(_request: dto.EditProductRequest): Promise<dto.EditProductResponse> {
		return Promise.resolve(null)
	}

	/**
	 * @see IProductService.hardDeleteSingle
	 */
	public hardDeleteSingle(_request: dto.DeleteProductRequest): Promise<dto.DeleteProductResponse> {
		return Promise.resolve(null)
	}

	/**
	 * @see IProductService.hardDeleteMany
	 */
	public hardDeleteMany(_request: dto.DeleteProductRequest): Promise<dto.DeleteProductResponse> {
		return Promise.resolve(null)
	}

	/**
	 * @see IProductService.getList
	 */
	public getList(_request: dto.GetProductListRequest): Promise<dto.GetProductListResponse> {
		return Promise.resolve(null)
	}

	/**
	 * @see IProductService.getRecalledList
	 */
	public getRecalledList(_request: dto.GetProductListRequest): Promise<dto.GetProductListResponse> {
		return Promise.resolve(null)
	}

	// #endregion Not implemented

}
