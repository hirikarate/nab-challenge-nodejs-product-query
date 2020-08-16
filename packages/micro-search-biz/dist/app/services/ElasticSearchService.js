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
        const filterIndexPromise = this._esClient.index(buildParams(Indices_1.default.PRODUCT_FILTER));
        const searchIndexPromise = this._esClient.index(buildParams(Indices_1.default.PRODUCT_SEARCH));
        await Promise.all([filterIndexPromise, searchIndexPromise]);
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
        const filterIndexPromise = this._esClient.update(buildParams(Indices_1.default.PRODUCT_FILTER));
        const searchIndexPromise = this._esClient.update(buildParams(Indices_1.default.PRODUCT_SEARCH));
        await Promise.all([filterIndexPromise, searchIndexPromise]).catch(this._ignoreNonExisting);
        return dto.EditIndexResponse.from({
            updatedAt: date_utils_1.momentify().format(),
        });
    }
    /**
     * @see ISearchCommandService.hardDelete
     */
    async hardDelete(params) {
        const buildParams = (index, id) => ({ index, id });
        const filterIndexPromise = Promise.all(params.ids.map(id => this._esClient.delete(buildParams(Indices_1.default.PRODUCT_FILTER, id))));
        const searchIndexPromise = Promise.all(params.ids.map(id => this._esClient.delete(buildParams(Indices_1.default.PRODUCT_SEARCH, id))));
        await Promise.all([filterIndexPromise, searchIndexPromise]).catch(this._ignoreNonExisting);
        return dto.DeleteIndexResponse.from({
            deletedAt: date_utils_1.momentify().format(),
        });
    }
    /**
     * @see ISearchQueryService.searchAdvanced
     */
    searchAdvanced(params) {
        return Promise.resolve(null);
    }
};
ElasticSearchService = __decorate([
    common_1.decorators.injectable(),
    __param(0, common_1.decorators.inject(Types_1.Types.ELASTIC_SEARCH_CLIENT)),
    __metadata("design:paramtypes", [elasticsearch_1.Client])
], ElasticSearchService);
exports.ElasticSearchService = ElasticSearchService;
//# sourceMappingURL=ElasticSearchService.js.map