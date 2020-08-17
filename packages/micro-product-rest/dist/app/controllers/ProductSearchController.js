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
const dto = require("../contracts-product-search/dto/search");
let ProductSearchController = class ProductSearchController extends web_1.RestControllerBase {
    constructor(_searchSvc) {
        super();
        this._searchSvc = _searchSvc;
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
};
__decorate([
    web_1.decorators.GET('/filter'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.query,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.FilterRequest]),
    __metadata("design:returntype", void 0)
], ProductSearchController.prototype, "filter", null);
__decorate([
    web_1.decorators.GET('/advanced'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.query,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.SearchAdvancedRequest]),
    __metadata("design:returntype", void 0)
], ProductSearchController.prototype, "searchAdvanced", null);
ProductSearchController = __decorate([
    web_1.decorators.controller('products/search'),
    __param(0, common_1.decorators.inject(Types_1.Types.SEARCH_SVC)),
    __metadata("design:paramtypes", [Object])
], ProductSearchController);
exports.default = ProductSearchController;
//# sourceMappingURL=ProductSearchController.js.map