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
const dto = require("../contracts/dto/search");
const controller_util_1 = require("../utils/controller-util");
/**
 * Accepts mediate requests for product searching operations.
 */
let SearchQueryController = class SearchQueryController {
    constructor(_searchSvc) {
        this._searchSvc = _searchSvc;
        debug('SearchQueryController instantiated');
    }
    filter(request) {
        try {
            return this._searchSvc.filter(request);
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    searchAdvanced(request) {
        try {
            return this._searchSvc.searchAdvanced(request);
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
};
__decorate([
    service_communication_1.decorators.action(dto.Action.FILTER),
    __param(0, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.FilterRequest]),
    __metadata("design:returntype", Promise)
], SearchQueryController.prototype, "filter", null);
__decorate([
    service_communication_1.decorators.action(dto.Action.SEARCH_ADVANCED),
    __param(0, controller_util_1.trustPayload()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.SearchAdvancedRequest]),
    __metadata("design:returntype", Promise)
], SearchQueryController.prototype, "searchAdvanced", null);
SearchQueryController = __decorate([
    service_communication_1.decorators.mediateController(dto.MODULE_NAME),
    __param(0, inject(Types_1.Types.SEARCH_QUERY_SVC)),
    __metadata("design:paramtypes", [Object])
], SearchQueryController);
exports.default = SearchQueryController;
//# sourceMappingURL=SearchQueryController.js.map