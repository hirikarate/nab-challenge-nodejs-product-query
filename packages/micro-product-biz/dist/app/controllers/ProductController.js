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
/// <reference types="debug" />
const debug = require('debug')('nab:ctrl:product');
const cm = require("@micro-fleet/common");
const { inject } = cm.decorators;
const service_communication_1 = require("@micro-fleet/service-communication");
const Types_1 = require("../constants/Types");
const dto = require("../contracts/dto/product");
const controller_util_1 = require("../utils/controller-util");
const { Action: A, MODULE_NAME } = dto;
/**
 * Listens to message broker and handles requests for product operations.
 */
let ProductController = class ProductController {
    constructor(_productSvc) {
        this._productSvc = _productSvc;
        debug('ProductController instantiated');
    }
    /*
     * Topic for all actions here:
     * `request.{MODULE_NAME}.{Action.NAME}`
     */
    create(request) {
        return this._productSvc.create(request);
    }
    edit(request) {
        return this._productSvc.edit(request);
    }
    getById(request) {
        return this._productSvc.getById(request);
    }
    getList(request) {
        return this._productSvc.getList(request);
    }
    getRecalledList(request) {
        return this._productSvc.getRecalledList(request);
    }
    hardDelete(request) {
        return this._productSvc.hardDeleteMany(request);
    }
};
__decorate([
    service_communication_1.decorators.action(A.CREATE),
    __param(0, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.CreateProductRequest]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    service_communication_1.decorators.action(A.EDIT),
    __param(0, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.EditProductRequest]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "edit", null);
__decorate([
    service_communication_1.decorators.action(A.GET_BY_ID),
    __param(0, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetProductByIdRequest]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getById", null);
__decorate([
    service_communication_1.decorators.action(A.GET_LIST),
    __param(0, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetProductListRequest]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getList", null);
__decorate([
    service_communication_1.decorators.action(A.GET_RECALLED_LIST),
    __param(0, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetProductListRequest]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getRecalledList", null);
__decorate([
    service_communication_1.decorators.action(A.HARD_DELETE),
    __param(0, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.DeleteProductRequest]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "hardDelete", null);
ProductController = __decorate([
    service_communication_1.decorators.mediateController(MODULE_NAME),
    service_communication_1.decorators.directController(MODULE_NAME),
    __param(0, inject(Types_1.Types.PRODUCT_SVC)),
    __metadata("design:paramtypes", [Object])
], ProductController);
exports.default = ProductController;
//# sourceMappingURL=ProductController.js.map