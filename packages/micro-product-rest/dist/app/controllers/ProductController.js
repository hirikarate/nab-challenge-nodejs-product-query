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
const dto = require("../contracts-product-management/dto/product");
let ProductController = class ProductController extends web_1.RestControllerBase {
    constructor(_productDirectSvc, _productMediateSvc) {
        super();
        this._productDirectSvc = _productDirectSvc;
        this._productMediateSvc = _productMediateSvc;
        debug('ProductController instantiated');
    }
    /**
     * GET {prefix}/products/:id?fields=prop
     * @example /api/v1/products/123654?fields=id&fields=name
     */
    getOne(params) {
        return this._productMediateSvc.getById(params);
    }
    /**
     * GET {prefix}/products/
     * @example /api/v1/products?pageIndex=2&pageSize=10&sortBy=name&sortType=desc
     */
    getList(params) {
        return this._productDirectSvc.getList(params);
    }
    /**
     * POST {prefix}/products
     * @example /api/v1/products
     *
     */
    async create(params) {
        return this._productMediateSvc.create(params);
    }
    /**
     * PATCH {prefix}/products
     * @example /api/v1/products
     */
    edit(params) {
        return this._productMediateSvc.edit(params);
    }
    /**
     * DELETE {prefix}/products/:ids
     * @example /api/v1/products/123654
     */
    deleteSingle(params) {
        return this._productMediateSvc.hardDeleteSingle(params);
    }
    /**
     * DELETE {prefix}/products
     * @example /api/v1/products?ids=123&ids=456&ids=789
     */
    deleteMany(params) {
        return this._productMediateSvc.hardDeleteMany(params);
    }
};
__decorate([
    web_1.decorators.GET(':id'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => ({
            id: r.params.id,
            ...r.query,
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetProductByIdRequest]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getOne", null);
__decorate([
    web_1.decorators.GET('/'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.query,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetProductListRequest]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getList", null);
__decorate([
    web_1.decorators.POST('/'),
    __param(0, web_1.decorators.model()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.CreateProductRequest]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    web_1.decorators.PATCH('/'),
    __param(0, web_1.decorators.model({ isPartial: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.EditProductRequest]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "edit", null);
__decorate([
    web_1.decorators.DELETE(':ids'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.params,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.DeleteProductRequest]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteSingle", null);
__decorate([
    web_1.decorators.DELETE('/'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.query,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.DeleteProductRequest]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteMany", null);
ProductController = __decorate([
    web_1.decorators.controller('products'),
    __param(0, common_1.decorators.inject(Types_1.Types.PRODUCT_DIRECT_SVC)),
    __param(1, common_1.decorators.inject(Types_1.Types.PRODUCT_MEDIATE_SVC)),
    __metadata("design:paramtypes", [Object, Object])
], ProductController);
exports.default = ProductController;
//# sourceMappingURL=ProductController.js.map