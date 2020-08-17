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
/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug = require('debug')('nab:ctrl:product');
const common_1 = require("@micro-fleet/common");
const web_1 = require("@micro-fleet/web");
const Types_1 = require("../constants/Types");
const sdto = require("../contracts-product-search/dto/search");
const pdto = require("../contracts-product-management/dto/product");
let ProductSearchController = class ProductSearchController extends web_1.RestControllerBase {
    constructor(_searchSvc, _productSvc) {
        super();
        this._searchSvc = _searchSvc;
        this._productSvc = _productSvc;
        debug('ProductSearchController instantiated');
    }
    /**
     * GET {prefix}/products/search
     * @example /api/v1/products/search?
     */
    filter(params) {
        return this._searchSvc.filter(params);
    }
    /**
     * GET {prefix}/products/search
     * @example /api/v1/products/search?
     */
    searchAdvanced(params) {
        return this._searchSvc.searchAdvanced(params);
    }
    /**
     * GET {prefix}/products/:id?fields=prop
     * @example /api/v1/products/123654?fields=id&fields=name
     */
    getOne(params) {
        return this._productSvc.getById(params);
    }
};
__decorate([
    web_1.decorators.GET('/filter'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => ({
            ...r.query,
            viewer: buildViewerObject(r),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sdto.FilterRequest]),
    __metadata("design:returntype", void 0)
], ProductSearchController.prototype, "filter", null);
__decorate([
    web_1.decorators.GET('/advanced'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => ({
            ...r.query,
            viewer: buildViewerObject(r),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sdto.SearchAdvancedRequest]),
    __metadata("design:returntype", void 0)
], ProductSearchController.prototype, "searchAdvanced", null);
__decorate([
    web_1.decorators.GET(':id'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => ({
            ...r.query,
            id: r.params.id,
            viewer: buildViewerObject(r),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pdto.GetProductByIdRequest]),
    __metadata("design:returntype", void 0)
], ProductSearchController.prototype, "getOne", null);
ProductSearchController = __decorate([
    web_1.decorators.controller('products/search'),
    __param(0, common_1.decorators.inject(Types_1.Types.SEARCH_SVC)),
    __param(1, common_1.decorators.inject(Types_1.Types.PRODUCT_MEDIATE_SVC)),
    __metadata("design:paramtypes", [Object, Object])
], ProductSearchController);
exports.default = ProductSearchController;
const buildViewerObject = (httpRequest) => {
    var _a;
    return ({
        ipAddress: httpRequest.headers['x-forwarded-for'] || httpRequest.connection.remoteAddress,
        deviceName: httpRequest.headers['user-agent'],
        userId: (_a = httpRequest.extras['user']) === null || _a === void 0 ? void 0 : _a.id,
    });
};
//# sourceMappingURL=ProductSearchController.js.map