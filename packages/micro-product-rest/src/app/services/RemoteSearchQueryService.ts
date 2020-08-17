/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:search')

import { cacheable } from '@micro-fleet/cache'
import { decorators as d } from '@micro-fleet/common'
import { Types as sT, IDirectRpcCaller } from '@micro-fleet/service-communication'

import * as dto from '../contracts-product-search/dto/search'
import { ISearchQueryService } from '../contracts-product-search/interfaces/ISearchQueryService'
import { RemoteServiceBase } from './RemoteServiceBase'


const { Action: A } = dto

export class RemoteSearchQueryService extends RemoteServiceBase implements ISearchQueryService {
	constructor(@d.inject(sT.DIRECT_RPC_CALLER) rpcCaller: IDirectRpcCaller) {
		super(dto.MODULE_NAME, rpcCaller)
		debug('RemoteSearchQueryService instantiated')
	}

	/**
	 * @see ISearchQueryService.filter
	 */
	@cacheable({
		cacheKey: 'searchSvc:filter',
		duration: 10,
	})
	public filter(request: dto.FilterRequest): Promise<dto.SearchResponse> {
		return this.$call(A.FILTER, request, dto.SearchResponse)
	}

	/**
	 * @see ISearchQueryService.searchAdvanced
	 */
	@cacheable({
		cacheKey: 'searchSvc:searchAdvanced',
		duration: 10,
	})
	public searchAdvanced(request: dto.SearchAdvancedRequest): Promise<dto.SearchResponse> {
		return this.$call(A.SEARCH_ADVANCED, request, dto.SearchResponse)
	}
}
