/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:product')

import { Client, ApiResponse } from '@elastic/elasticsearch'
import { decorators as d } from '@micro-fleet/common'

import Indices from '../constants/Indices'
import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/search'
import { ISearchCommandService } from '../contracts/interfaces/ISearchCommandService'
import { ISearchQueryService } from '../contracts/interfaces/ISearchQueryService'
import { momentify } from '../utils/date-utils'


@d.injectable()
export class ElasticSearchService implements ISearchCommandService, ISearchQueryService {

	constructor(
		@d.inject(T.ELASTIC_SEARCH_CLIENT) private _esClient: Client,
	) {
		debug('ElasticSearchService instantiated')
	}

	/**
	 * @see ISearchCommandService.createIndex
	 */
	public async createIndex(params: dto.CreateIndexRequest): Promise<dto.CreateIndexResponse> {
		const buildParams = (index: string) => ({
			index,
			id: params.id,
			body: params,
		})
		const filterIndexPromise = this._esClient.index(buildParams(Indices.PRODUCT_FILTER))
		const searchIndexPromise = this._esClient.index(buildParams(Indices.PRODUCT_SEARCH))

		await Promise.all([filterIndexPromise, searchIndexPromise])
		return dto.CreateIndexResponse.from({
			createdAt: momentify().format(),
		})
	}

	/**
	 * @see ISearchCommandService.editIndex
	 */
	public async editIndex(params: dto.EditIndexRequest): Promise<dto.EditIndexResponse> {
		const buildParams = (index: string) => ({
			index,
			id: params.id,
			body: {
				doc: params,
			},
		})
		const filterIndexPromise = this._esClient.update(buildParams(Indices.PRODUCT_FILTER))
		const searchIndexPromise = this._esClient.update(buildParams(Indices.PRODUCT_SEARCH))

		await Promise.all([filterIndexPromise, searchIndexPromise]).catch(this._ignoreNonExisting)
		return dto.EditIndexResponse.from({
			updatedAt: momentify().format(),
		})
	}

	/**
	 * @see ISearchCommandService.hardDelete
	 */
	public async hardDelete(params: dto.DeleteIndexRequest): Promise<dto.DeleteIndexResponse> {
		const buildParams = (index: string, id: string) => ({ index, id })

		const filterIndexPromise = Promise.all(
			params.ids.map(id => this._esClient.delete(buildParams(Indices.PRODUCT_FILTER, id))),
		)
		const searchIndexPromise = Promise.all(
			params.ids.map(id => this._esClient.delete(buildParams(Indices.PRODUCT_SEARCH, id))),
		)
		await Promise.all([filterIndexPromise, searchIndexPromise]).catch(this._ignoreNonExisting)
		return dto.DeleteIndexResponse.from({
			deletedAt: momentify().format(),
		})
	}

	/**
	 * @see ISearchQueryService.searchAdvanced
	 */
	public searchAdvanced(params: dto.SearchAdvancedRequest): Promise<dto.SearchAdvancedResponse> {
		return Promise.resolve(null)
	}

	private _ignoreNonExisting = (error: ApiResponse) => {
		if (error.statusCode !== 404) {
			// eslint-disable-next-line @typescript-eslint/no-throw-literal
			throw error
		}
	}
}
