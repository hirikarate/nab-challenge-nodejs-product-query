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
const debug = require('debug')('nab:ctrl:statistics');
const cm = require("@micro-fleet/common");
const { inject } = cm.decorators;
const service_communication_1 = require("@micro-fleet/service-communication");
const Types_1 = require("../constants/Types");
const dto = require("../contracts/dto/statistics");
const pdto = require("../contracts-product-management/dto/product");
const sdto = require("../contracts-product-search/dto/search");
const controller_util_1 = require("../utils/controller-util");
/**
 * Listens to message broker and takes actions when product operations occur.
 */
let StatisticsController = class StatisticsController {
    constructor(_statisticsSvc) {
        this._statisticsSvc = _statisticsSvc;
        debug('StatisticsController instantiated');
    }
    /**
     * Logs the request when a product detail is viewed.
     */
    onGetProductById(resolve, // Inject this to disable auto responding
    params) {
        const { viewer, ...payload } = params;
        this._createRequestLog('getProductById', viewer, payload);
    }
    /**
     * Logs the request when products are filtered.
     */
    onFilterProduct(resolve, // Inject this to disable auto responding
    params) {
        const { viewer, ...payload } = params;
        this._createRequestLog('filterProduct', viewer, payload);
    }
    /**
     * Logs the request when products are searched.
     */
    onAdvancedSearchProduct(resolve, // Inject this to disable auto responding
    params) {
        const { viewer, ...payload } = params;
        this._createRequestLog('advancedSearchProduct', viewer, payload);
    }
    _createRequestLog(operationName, viewer, requestPayload) {
        // Do not log for admin user
        if (!viewer || viewer.userId) {
            return;
        }
        const statisticsParams = dto.CreateStatisticsRequest.from({
            operationName,
            deviceName: viewer.deviceName,
            ipAddress: viewer.ipAddress,
            requestPayload,
        });
        this._statisticsSvc.create(statisticsParams).catch(console.error);
    }
};
__decorate([
    service_communication_1.decorators.action(`request.${pdto.MODULE_NAME}.${pdto.Action.GET_BY_ID}`, true),
    __param(0, service_communication_1.decorators.resolveFn()),
    __param(1, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, pdto.GetProductByIdRequest]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "onGetProductById", null);
__decorate([
    service_communication_1.decorators.action(`request.${sdto.MODULE_NAME}.${sdto.Action.FILTER}`, true),
    __param(0, service_communication_1.decorators.resolveFn()),
    __param(1, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, sdto.FilterRequest]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "onFilterProduct", null);
__decorate([
    service_communication_1.decorators.action(`request.${sdto.MODULE_NAME}.${sdto.Action.SEARCH_ADVANCED}`, true),
    __param(0, service_communication_1.decorators.resolveFn()),
    __param(1, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, sdto.SearchAdvancedRequest]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "onAdvancedSearchProduct", null);
StatisticsController = __decorate([
    service_communication_1.decorators.mediateController(),
    __param(0, inject(Types_1.Types.STATISTICS_SVC)),
    __metadata("design:paramtypes", [Object])
], StatisticsController);
exports.default = StatisticsController;
//# sourceMappingURL=StatisticsController.js.map