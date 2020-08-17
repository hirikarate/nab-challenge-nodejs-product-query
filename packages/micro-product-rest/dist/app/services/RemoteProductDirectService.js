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
exports.RemoteProductDirectService = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:svc:product');
const cache_1 = require("@micro-fleet/cache");
const common_1 = require("@micro-fleet/common");
const service_communication_1 = require("@micro-fleet/service-communication");
const dto = require("../contracts-product-management/dto/product");
const RemoteServiceBase_1 = require("./RemoteServiceBase");
const { Action: A } = dto;
let RemoteProductDirectService = class RemoteProductDirectService extends RemoteServiceBase_1.RemoteServiceBase {
    constructor(rpcCaller) {
        super(dto.MODULE_NAME, rpcCaller);
        debug('RemoteProductDirectService instantiated');
    }
    /**
     * @see IProductService.create
     */
    create(request) {
        return this.$call(A.CREATE, request, dto.CreateProductResponse);
    }
    /**
     * @see IProductService.edit
     */
    edit(request) {
        return this.$call(A.EDIT, request, dto.EditProductResponse);
    }
    /**
     * @see IProductService.hardDeleteSingle
     */
    hardDeleteSingle(request) {
        return this.$call(A.HARD_DELETE, request, dto.DeleteProductResponse);
    }
    /**
     * @see IProductService.hardDeleteMany
     */
    hardDeleteMany(request) {
        return this.$call(A.HARD_DELETE, request, dto.DeleteProductResponse);
    }
    /**
     * @see IProductService.getById
     */
    getById(request) {
        return this.$call(A.GET_BY_ID, request, dto.GetSingleProductResponse);
    }
    /**
     * @see IProductService.getList
     */
    getList(request) {
        return this.$call(A.GET_LIST, request, dto.GetProductListResponse);
    }
    /**
     * @see IProductService.getRecalledList
     */
    getRecalledList(request) {
        return this.$call(A.GET_RECALLED_LIST, request, dto.GetProductListResponse);
    }
};
__decorate([
    cache_1.cacheable({
        cacheKey: 'productSvc:getById',
        duration: 10,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetProductByIdRequest]),
    __metadata("design:returntype", Promise)
], RemoteProductDirectService.prototype, "getById", null);
__decorate([
    cache_1.cacheable({
        cacheKey: 'productSvc:getList',
        duration: 10,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetProductListRequest]),
    __metadata("design:returntype", Promise)
], RemoteProductDirectService.prototype, "getList", null);
__decorate([
    cache_1.cacheable({
        cacheKey: 'productSvc:getRecalledList',
        duration: 10,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetProductListRequest]),
    __metadata("design:returntype", Promise)
], RemoteProductDirectService.prototype, "getRecalledList", null);
RemoteProductDirectService = __decorate([
    __param(0, common_1.decorators.inject(service_communication_1.Types.DIRECT_RPC_CALLER)),
    __metadata("design:paramtypes", [Object])
], RemoteProductDirectService);
exports.RemoteProductDirectService = RemoteProductDirectService;
//# sourceMappingURL=RemoteProductDirectService.js.map