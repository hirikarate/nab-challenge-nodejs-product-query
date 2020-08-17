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
exports.RemoteSearchQueryService = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:svc:search');
const cache_1 = require("@micro-fleet/cache");
const common_1 = require("@micro-fleet/common");
const service_communication_1 = require("@micro-fleet/service-communication");
const dto = require("../contracts-product-search/dto/search");
const RemoteServiceBase_1 = require("./RemoteServiceBase");
const { Action: A } = dto;
let RemoteSearchQueryService = class RemoteSearchQueryService extends RemoteServiceBase_1.RemoteServiceBase {
    constructor(rpcCaller) {
        super(dto.MODULE_NAME, rpcCaller);
        debug('RemoteSearchQueryService instantiated');
    }
    /**
     * @see ISearchQueryService.filter
     */
    filter(request) {
        return this.$call(A.FILTER, request, dto.SearchResponse);
    }
    /**
     * @see ISearchQueryService.searchAdvanced
     */
    searchAdvanced(request) {
        return this.$call(A.SEARCH_ADVANCED, request, dto.SearchResponse);
    }
};
__decorate([
    cache_1.cacheable({
        cacheKey: 'searchSvc:filter',
        duration: 10,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.FilterRequest]),
    __metadata("design:returntype", Promise)
], RemoteSearchQueryService.prototype, "filter", null);
__decorate([
    cache_1.cacheable({
        cacheKey: 'searchSvc:searchAdvanced',
        duration: 10,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.SearchAdvancedRequest]),
    __metadata("design:returntype", Promise)
], RemoteSearchQueryService.prototype, "searchAdvanced", null);
RemoteSearchQueryService = __decorate([
    __param(0, common_1.decorators.inject(service_communication_1.Types.MEDIATE_RPC_CALLER)),
    __metadata("design:paramtypes", [Object])
], RemoteSearchQueryService);
exports.RemoteSearchQueryService = RemoteSearchQueryService;
//# sourceMappingURL=RemoteSearchQueryService.js.map