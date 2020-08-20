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
exports.RemoteCategoryService = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:svc:category');
const cache_1 = require("@micro-fleet/cache");
const common_1 = require("@micro-fleet/common");
const service_communication_1 = require("@micro-fleet/service-communication");
const dto = require("../contracts-product-management/dto/category");
const RemoteServiceBase_1 = require("./RemoteServiceBase");
const { Action: A } = dto;
let RemoteCategoryService = class RemoteCategoryService extends RemoteServiceBase_1.RemoteServiceBase {
    constructor(rpcCaller) {
        super(dto.MODULE_NAME, rpcCaller);
        debug('RemoteCategoryService instantiated');
    }
    /**
     * @see ICategoryService.create
     */
    create(request) {
        return this.$call(A.CREATE, request, dto.CreateCategoryResponse);
    }
    /**
     * @see ICategoryService.edit
     */
    edit(request) {
        return this.$call(A.EDIT, request, dto.EditCategoryResponse);
    }
    /**
     * @see ICategoryService.exists
     */
    exists(request) {
        return this.$call(A.EXISTS, request, dto.CheckCategoryExistingResponse);
    }
    /**
     * @see ICategoryService.hardDeleteSingle
     */
    hardDeleteSingle(request) {
        return this.$call(A.HARD_DELETE, request, dto.DeleteCategoryResponse);
    }
    /**
     * @see ICategoryService.hardDeleteMany
     */
    hardDeleteMany(request) {
        return this.$call(A.HARD_DELETE, request, dto.DeleteCategoryResponse);
    }
    /**
     * @see ICategoryService.getById
     */
    getById(request) {
        return this.$call(A.GET_BY_ID, request, dto.GetSingleCategoryResponse);
    }
    /**
     * @see ICategoryService.getList
     */
    getList(request) {
        return this.$call(A.GET_LIST, request, dto.GetCategoryListResponse);
    }
};
__decorate([
    cache_1.cacheable({
        cacheKey: 'categorySvc:getById',
        duration: 10,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetCategoryByIdRequest]),
    __metadata("design:returntype", Promise)
], RemoteCategoryService.prototype, "getById", null);
__decorate([
    cache_1.cacheable({
        cacheKey: 'categorySvc:getList',
        duration: 10,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetCategoryListRequest]),
    __metadata("design:returntype", Promise)
], RemoteCategoryService.prototype, "getList", null);
RemoteCategoryService = __decorate([
    __param(0, common_1.decorators.inject(service_communication_1.Types.MEDIATE_RPC_CALLER)),
    __metadata("design:paramtypes", [Object])
], RemoteCategoryService);
exports.RemoteCategoryService = RemoteCategoryService;
//# sourceMappingURL=RemoteCategoryService.js.map