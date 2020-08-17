"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticSearchService = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:svc:product');
const elasticsearch_1 = require("@elastic/elasticsearch");
const common_1 = require("@micro-fleet/common");
const Indices_1 = require("../constants/Indices");
const Types_1 = require("../constants/Types");
const dto = require("../contracts/dto/search");
const date_utils_1 = require("../utils/date-utils");
const functional_utils_1 = require("../utils/functional-utils");
let ElasticSearchService = class ElasticSearchService {
    constructor(_esClient) {
        this._esClient = _esClient;
        this._ignoreNonExisting = (error) => {
            if (error.statusCode !== 404) {
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw error;
            }
        };
        debug('ElasticSearchService instantiated');
    }
    /**
     * @see ISearchCommandService.createIndex
     */
    async createIndex(params) {
        const buildParams = (index) => ({
            index,
            id: params.id,
            body: params,
        });
        await this._esClient.index(buildParams(Indices_1.default.PRODUCTS));
        return dto.CreateIndexResponse.from({
            createdAt: date_utils_1.momentify().format(),
        });
    }
    /**
     * @see ISearchCommandService.editIndex
     */
    async editIndex(params) {
        const buildParams = (index) => ({
            index,
            id: params.id,
            body: {
                doc: params,
            },
        });
        await this._esClient
            .update(buildParams(Indices_1.default.PRODUCTS))
            .catch(this._ignoreNonExisting);
        return dto.EditIndexResponse.from({
            updatedAt: date_utils_1.momentify().format(),
        });
    }
    /**
     * @see ISearchCommandService.hardDelete
     */
    async hardDelete(params) {
        const buildParams = (index, id) => ({ index, id });
        await Promise
            .all(params.ids.map(id => this._esClient.delete(buildParams(Indices_1.default.PRODUCTS, id))))
            .catch(this._ignoreNonExisting);
        return dto.DeleteIndexResponse.from({
            deletedAt: date_utils_1.momentify().format(),
        });
    }
    /**
     * @see ISearchQueryService.filter
     */
    async filter(params) {
        const response = await this._esClient.search({
            index: Indices_1.default.PRODUCTS,
            body: {
                query: buildFilterQuery(params),
            },
        });
        const results = (response.body.hits.total.value)
            ? response.body.hits.hits.map((hit) => hit._source)
            : [];
        return dto.SearchResponse.from({
            items: results,
            total: response.body.hits.total.value,
        });
    }
    /**
     * @see ISearchQueryService.searchAdvanced
     */
    async searchAdvanced(params) {
		const body =  {
			query: buildSearchQuery(params),
		}
		console.dir({ body }, { depth: 10 })
        const response = await this._esClient.search({
            index: Indices_1.default.PRODUCTS,
            body,
        });
        const results = (response.body.hits.total.value)
            ? response.body.hits.hits.map((hit) => hit._source)
            : [];
        return dto.SearchResponse.from({
            items: results,
            total: response.body.hits.total.value,
        });
    }
};
ElasticSearchService = __decorate([
    common_1.decorators.injectable(),
    __param(0, common_1.decorators.inject(Types_1.Types.ELASTIC_SEARCH_CLIENT)),
    __metadata("design:paramtypes", [elasticsearch_1.Client])
], ElasticSearchService);
exports.ElasticSearchService = ElasticSearchService;
function buildFilterQuery(params) {
    const query = {
        bool: {
            must: [],
            filter: [],
        },
    };
    return functional_utils_1.pipe(buildNameQuery(params), buildColorQuery(params), buildPriceFilter(params), buildBranchesFilter(params), buildCategoryFilter(params), buildStatusFilter(params))(query);
}
function buildSearchQuery(params) {
    const query = {
        bool: {
            must: [],
            filter: [],
        },
    };
    return functional_utils_1.pipe(buildMultiFieldMathQuery(params), buildPriceFilter(params), buildBranchesFilter(params), buildCategoryFilter(params), buildStatusFilter(params))(query);
}
const buildNameQuery = (params) => (queryObject) => {
    if (params.name) {
        queryObject.bool.must.push({
            match: {
                name: {
                    query: params.name,
                },
            },
        });
    }
    return queryObject;
};
const buildColorQuery = (params) => (queryObject) => {
    if (params.color) {
        queryObject.bool.must.push({
            match: {
                color: {
                    query: params.color,
                },
            },
        });
    }
    return queryObject;
};
const buildMultiFieldMathQuery = (params) => (queryObject) => {
    queryObject.bool.must.push({
        multi_match: {
            query: params.keywords,
            type: 'cross_fields',
            fields: ['name', 'color'],
            operator: 'or',
        },
    });
    return queryObject;
};
const buildPriceFilter = (params) => (queryObject) => {
    const priceFilter = {
        range: {
            price: {
            },
        },
    };
    if (params.minPrice) {
        priceFilter.range.price.gte = params.minPrice;
    }
    if (params.maxPrice) {
        priceFilter.range.price.lte = params.maxPrice;
    }
    if (params.maxPrice || params.minPrice) {
        queryObject.bool.filter.push(priceFilter);
    }
    return queryObject;
};
const buildBranchesFilter = (params) => (queryObject) => {
    if (params.branchIds) {
        queryObject.bool.filter.push({
            terms: {
                branchIds: params.branchIds,
            },
        });
    }
    return queryObject;
};
const buildCategoryFilter = (params) => (queryObject) => {
    if (params.categoryIds) {
        queryObject.bool.filter.push({
            terms: {
                categoryId: params.categoryIds,
            },
        });
    }
    return queryObject;
};
const buildStatusFilter = (params) => (queryObject) => {
    if (params.status) {
        queryObject.bool.filter.push({
            term: {
                status: params.status,
            },
        });
    }
    return queryObject;
};
//# sourceMappingURL=ElasticSearchService.js.map