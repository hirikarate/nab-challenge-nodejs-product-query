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
import { pipe } from '../utils/functional-utils'


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
		await this._esClient.index(buildParams(Indices.PRODUCTS))

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
		await this._esClient
			.update(buildParams(Indices.PRODUCTS))
			.catch(this._ignoreNonExisting)

		return dto.EditIndexResponse.from({
			updatedAt: momentify().format(),
		})
	}

	/**
	 * @see ISearchCommandService.hardDelete
	 */
	public async hardDelete(params: dto.DeleteIndexRequest): Promise<dto.DeleteIndexResponse> {
		const buildParams = (index: string, id: string) => ({ index, id })
		await Promise
			.all(
				params.ids.map(id => this._esClient.delete(buildParams(Indices.PRODUCTS, id))),
			)
			.catch(this._ignoreNonExisting)

		return dto.DeleteIndexResponse.from({
			deletedAt: momentify().format(),
		})
	}

	/**
	 * @see ISearchQueryService.filter
	 */
	public async filter(params: dto.FilterRequest): Promise<dto.SearchResponse> {
		const response: ApiResponse = await this._esClient.search({
			index: Indices.PRODUCTS,
			body: {
				query: buildFilterQuery(params),
			},
		})
		const results: object[] = (response.body.hits.total.value)
			? response.body.hits.hits.map((hit: any) => hit._source)
			: []
		return dto.SearchResponse.from({
			items: results,
			total: response.body.hits.total.value,
		})
	}

	/**
	 * @see ISearchQueryService.searchAdvanced
	 */
	public async searchAdvanced(params: dto.SearchAdvancedRequest): Promise<dto.SearchResponse> {
		const response: ApiResponse = await this._esClient.search({
			index: Indices.PRODUCTS,
			body: {
				query: buildSearchQuery(params),
			},
		})
		const results: object[] = (response.body.hits.total.value)
			? response.body.hits.hits.map((hit: any) => hit._source)
			: []
		return dto.SearchResponse.from({
			items: results,
			total: response.body.hits.total.value,
		})
	}

	private _ignoreNonExisting = (error: ApiResponse) => {
		if (error.statusCode !== 404) {
			// eslint-disable-next-line @typescript-eslint/no-throw-literal
			throw error
		}
	}
}

function buildFilterQuery(params: dto.FilterRequest): any {
	const query: any = {
		bool: {
			must: [],
			filter: [],
		},
	}
	return pipe(
		buildNameQuery(params),
		buildColorQuery(params),
		buildPriceFilter(params),
		buildBranchesFilter(params),
		buildCategoryFilter(params),
		buildStatusFilter(params),
	)(query)
}

function buildSearchQuery(params: dto.SearchAdvancedRequest): any {
	const query: any = {
		bool: {
			must: [],
			filter: [],
		},
	}
	return pipe(
		buildMultiFieldMathQuery(params),
		buildPriceFilter(params),
		buildBranchesFilter(params),
		buildCategoryFilter(params),
		buildStatusFilter(params),
	)(query)
}

const buildNameQuery = (params: dto.FilterRequest) => (queryObject: any) => {
	if (params.name) {
		queryObject.bool.must.push({
			match: {
				name: {
					query: params.name,
				},
			},
		})
	}
	return queryObject
}

const buildColorQuery = (params: dto.FilterRequest) => (queryObject: any) => {
	if (params.color) {
		queryObject.bool.must.push({
			match: {
				color: {
					query: params.color,
				},
			},
		})
	}

	return queryObject
}

const buildMultiFieldMathQuery = (params: dto.SearchAdvancedRequest) => (queryObject: any) => {
	queryObject.bool.must.push({
		multi_match: {
			query: params.keywords,
			type: 'cross_fields',
			fields: ['name', 'color'],
			operator: 'or',
		},
	})

	return queryObject
}

const buildPriceFilter = (params: dto.FilterRequest | dto.SearchAdvancedRequest) => (queryObject: any) => {
	const priceFilter: any = {
		range: {
			price: {},
		},
	}

	if (params.minPrice) {
		priceFilter.range.price.gte = params.minPrice
	}
	if (params.maxPrice) {
		priceFilter.range.price.lte = params.maxPrice
	}
	if (params.maxPrice || params.minPrice) {
		queryObject.bool.filter.push(priceFilter)
	}

	return queryObject
}

const buildBranchesFilter = (params: dto.FilterRequest | dto.SearchAdvancedRequest) => (queryObject: any) => {
	if (params.branchIds) {
		queryObject.bool.filter.push({
			terms: {
				branchIds: params.branchIds,
			},
		})
	}

	return queryObject
}

const buildCategoryFilter = (params: dto.FilterRequest | dto.SearchAdvancedRequest) => (queryObject: any) => {
	if (params.categoryIds) {
		queryObject.bool.filter.push({
			terms: {
				categoryId: params.categoryIds,
			},
		})
	}

	return queryObject
}

const buildStatusFilter = (params: dto.FilterRequest | dto.SearchAdvancedRequest) => (queryObject: any) => {
	if (params.status) {
		queryObject.bool.filter.push({
			term: {
				status: params.status,
			},
		})
	}

	return queryObject
}
