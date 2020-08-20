import awsKeys from '../constants/dependencyKeys/aws';
import dependencyContainer from '../utils/dependencyContainer';
import {
	withCache,
} from '../utils/cacheHelpers';
import {
	compose,
	pipe,
	resolveInvoke,
	promiseThen,
	tap,
} from '../utils/functionalHelpers';
import {
	buildServiceListResult,
	withServiceErrorHandler,
} from '../utils/serviceHelpers';
import {
	withLogger,
} from './logService';


const logWithContext = withLogger('productSearchService');


// #region Private functions

/**
 * Makes request to ElasticSearch host
 *
 * @param {object} params The parameter object
 *
 * @returns {object} ElasticSearch response object
 */
const executeSearch = (params) => pipe(
	() => dependencyContainer.resolve(awsKeys.ES_HOST),
	resolveInvoke(dependencyContainer, awsKeys.AWS_ES_CREATE_CLIENT),
	(client) => client.search(params),
)();


function buildSearchResult(elasticSearchResponse) {
	const total = elasticSearchResponse.body.hits.total.value;
	const items = total
		? elasticSearchResponse.body.hits.hits.map((hit) => hit._source)
		: [];
	return { total, items };
}

const buildElasticSearchParam = (buildQueryFn) => (params) => ({
	index: 'products',
	body: {
		from: (params.pageIndex - 1) * params.pageSize,
		size: params.pageSize,
		query: buildQueryFn(params),
		...buildSortQuery(params),
	},
})


function buildFilterQuery(params) {
	const query = {
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


function buildSearchQuery(params) {
	const query = {
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

const buildNameQuery = (params) => (queryObject) => {
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

const buildColorQuery = (params) => (queryObject) => {
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

const buildMultiFieldMathQuery = (params) => (queryObject) => {
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

const buildPriceFilter = (params) => (queryObject) => {
	const priceFilter = {
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

const buildBranchesFilter = (params) => (queryObject) => {
	if (params.branchIds) {
		queryObject.bool.filter.push({
			terms: {
				branchIds: params.branchIds,
			},
		})
	}

	return queryObject
}

const buildCategoryFilter = (params) => (queryObject) => {
	if (params.categoryIds) {
		queryObject.bool.filter.push({
			terms: {
				categoryId: params.categoryIds,
			},
		})
	}

	return queryObject
}

const buildStatusFilter = (params) => (queryObject) => {
	if (params.status) {
		queryObject.bool.filter.push({
			term: {
				status: params.status,
			},
		})
	}

	return queryObject
}

function buildSortQuery(params) {
	if (!params.sortBy) {
		return {}
	}

	return {
		sort: [{
			[params.sortBy]: {
				order: params.sortType,
			},
		}],
	}
}

// #endregion Private functions


/**
 * Gets a subset of products with filter criteria.
 *
 * @param {object} params
 */
export const getFilterProducts = compose(
	withServiceErrorHandler('getFilterProducts'),
	withCache('getFilterProducts'),
)(
	pipe(
		buildElasticSearchParam(buildFilterQuery),
		executeSearch,
		promiseThen(logWithContext(
			(logger, results) => logger.debug('After executeSearch', {
				__FUNCTION: 'getFilterProducts',
				__DATA: { results },
			})
		)),
		promiseThen(buildSearchResult),
		buildServiceListResult,
	)
);

/**
 * Searches keywords with multiple criteria.
 * E.g: "Red Ferrari" will match products with name containing "Ferrari" and
 * color including "Red" keywords.
 *
 * @param {object} params
 */
export const searchAdvancedProducts = compose(
	withServiceErrorHandler('searchAdvancedProducts'),
	withCache('searchAdvancedProducts'),
)(
	pipe(
		buildElasticSearchParam(buildSearchQuery),
		executeSearch,
		promiseThen(buildSearchResult),
		buildServiceListResult,
	)
);
