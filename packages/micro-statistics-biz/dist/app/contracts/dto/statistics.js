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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStatisticsResponse = exports.CreateStatisticsRequest = exports.Action = exports.MODULE_NAME = void 0;
const joi = require("@hapi/joi");
const common_1 = require("@micro-fleet/common");
const dto_base_1 = require("./dto-base");
// #region RPC Constants
exports.MODULE_NAME = 'nabStatistics';
var Action;
(function (Action) {
    Action["CREATE"] = "create";
})(Action = exports.Action || (exports.Action = {}));
// #endregion RPC Constants
// #region Create
class CreateStatisticsRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.operationName = undefined;
        this.ipAddress = undefined;
        this.deviceName = undefined;
        this.requestPayload = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ minLength: 3, maxLength: 100 }),
    __metadata("design:type", String)
], CreateStatisticsRequest.prototype, "operationName", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], CreateStatisticsRequest.prototype, "ipAddress", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 200 }),
    __metadata("design:type", String)
], CreateStatisticsRequest.prototype, "deviceName", void 0);
__decorate([
    common_1.decorators.validateProp(joi.object()),
    __metadata("design:type", Object)
], CreateStatisticsRequest.prototype, "requestPayload", void 0);
exports.CreateStatisticsRequest = CreateStatisticsRequest;
class CreateStatisticsResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.createdAt = undefined;
    }
}
exports.CreateStatisticsResponse = CreateStatisticsResponse;
// #endregion Create
//# sourceMappingURL=statistics.js.map