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
const cm = require("@micro-fleet/common");
const { inject } = cm.decorators;
const service_communication_1 = require("@micro-fleet/service-communication");
const Types_1 = require("../constants/Types");
const dto = require("../contracts/dto/search");
const pdto = require("../contracts-product-management/dto/product");
const controller_util_1 = require("../utils/controller-util");
let SearchCommandController = class SearchCommandController {
    constructor(_searchSvc, _productSvc) {
        this._searchSvc = _searchSvc;
        this._productSvc = _productSvc;
        debug('SearchCommandController instantiated');
    }
    /**
     * Catches the response when a product is created and creates a corrensponding search index for it.
     */
    async createIndex(resolve, // Not calling
    params) {
        var _a;
        if (!params || !params.hasData) {
            return;
        }
        const productResponse = await this._fetchProduct(params.id);
        if (!productResponse.hasData) {
            return;
        }
        const indexRequest = dto.CreateIndexRequest.from({
            ...productResponse,
            branchIds: (_a = productResponse.branches) === null || _a === void 0 ? void 0 : _a.map(b => b.id),
        });
        await this._searchSvc.createIndex(indexRequest);
    }
    /**
     * Catches the response when a product is modified and updates the corrensponding search index.
     */
    async editIndex(resolve, // Not calling
    params) {
        var _a;
        if (!params || !params.hasData) {
            return;
        }
        const productResponse = await this._fetchProduct(params.id);
        if (!productResponse.hasData) {
            return;
        }
        const indexRequest = dto.EditIndexRequest.from({
            ...productResponse,
            branchIds: (_a = productResponse.branches) === null || _a === void 0 ? void 0 : _a.map(b => b.id),
        });
        await this._searchSvc.editIndex(indexRequest);
    }
    /**
     * Catches the response when a product is deleted and removes the corrensponding search index.
     */
    async deleteIndex(resolve, // Not calling
    params) {
        if (!params || !params.hasData) {
            return;
        }
        const indexRequest = dto.DeleteIndexRequest.from(params);
		try {
        	await this._searchSvc.hardDelete(indexRequest);
		} catch (err) {
			console.error(err)
		}
    }
    _fetchProduct(id) {
        const productRequest = pdto.GetProductByIdRequest.from({
            id,
            fields: pdto.PRODUCT_FIELDS,
            relations: pdto.PRODUCT_RELATIONS,
        });
        return this._productSvc.getById(productRequest);
    }
};
__decorate([
    service_communication_1.decorators.action(`response.${pdto.MODULE_NAME}.create.*`, true),
    __param(0, service_communication_1.decorators.resolveFn()),
    __param(1, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, pdto.CreateProductResponse]),
    __metadata("design:returntype", Promise)
], SearchCommandController.prototype, "createIndex", null);
__decorate([
    service_communication_1.decorators.action(`response.${pdto.MODULE_NAME}.edit.*`, true),
    __param(0, service_communication_1.decorators.resolveFn()),
    __param(1, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, pdto.EditProductResponse]),
    __metadata("design:returntype", Promise)
], SearchCommandController.prototype, "editIndex", null);
__decorate([
    service_communication_1.decorators.action(`response.${pdto.MODULE_NAME}.hardDelete.*`, true),
    __param(0, service_communication_1.decorators.resolveFn()),
    __param(1, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, pdto.DeleteProductResponse]),
    __metadata("design:returntype", Promise)
], SearchCommandController.prototype, "deleteIndex", null);
SearchCommandController = __decorate([
    service_communication_1.decorators.mediateController(),
    __param(0, inject(Types_1.Types.SEARCH_COMMAND_SVC)),
    __param(1, inject(Types_1.Types.PRODUCT_SVC)),
    __metadata("design:paramtypes", [Object, Object])
], SearchCommandController);
exports.default = SearchCommandController;
//# sourceMappingURL=SearchCommandController.js.map