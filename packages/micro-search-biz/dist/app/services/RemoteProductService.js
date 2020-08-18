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
exports.RemoteProductService = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:svc:product');
const common_1 = require("@micro-fleet/common");
const service_communication_1 = require("@micro-fleet/service-communication");
const dto = require("../contracts-product-management/dto/product");
const RemoteServiceBase_1 = require("./RemoteServiceBase");
const { Action: A } = dto;
let RemoteProductService = class RemoteProductService extends RemoteServiceBase_1.RemoteServiceBase {
    constructor(rpcCaller) {
        super(dto.MODULE_NAME, rpcCaller);
        debug('RemoteProductService instantiated');
    }
    /**
     * @see IProductService.getById
     */
    getById(request) {
        return this.$call(A.GET_BY_ID, request, dto.GetSingleProductResponse);
    }
    // #region Not implemented
    /**
     * @see IProductService.create
     */
    create(_request) {
        return Promise.resolve(null);
    }
    /**
     * @see IProductService.edit
     */
    edit(_request) {
        return Promise.resolve(null);
    }
    /**
     * @see IProductService.hardDeleteSingle
     */
    hardDeleteSingle(_request) {
        return Promise.resolve(null);
    }
    /**
     * @see IProductService.hardDeleteMany
     */
    hardDeleteMany(_request) {
        return Promise.resolve(null);
    }
    /**
     * @see IProductService.getList
     */
    getList(_request) {
        return Promise.resolve(null);
    }
    /**
     * @see IProductService.getRecalledList
     */
    getRecalledList(_request) {
        return Promise.resolve(null);
    }
};
RemoteProductService = __decorate([
    __param(0, common_1.decorators.inject(service_communication_1.Types.MEDIATE_RPC_CALLER)),
    __metadata("design:paramtypes", [Object])
], RemoteProductService);
exports.RemoteProductService = RemoteProductService;
//# sourceMappingURL=RemoteProductService.js.map