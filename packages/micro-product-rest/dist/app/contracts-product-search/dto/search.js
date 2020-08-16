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
exports.SearchAdvancedResponse = exports.SearchAdvancedRequest = exports.EditIndexResponse = exports.EditIndexRequest = exports.DeleteIndexResponse = exports.DeleteIndexRequest = exports.CreateIndexResponse = exports.CreateIndexRequest = exports.Action = exports.MODULE_NAME = void 0;
const joi = require("@hapi/joi");
const common_1 = require("@micro-fleet/common");
const dto_base_1 = require("./dto-base");
// #region RPC Constants
exports.MODULE_NAME = 'nabProductSearchEngine';
var Action;
(function (Action) {
    Action["CREATE_INDEX"] = "createIndex";
    Action["EDIT_INDEX"] = "editIndex";
    Action["HARD_DELETE"] = "hardDelete";
    Action["SEARCH_ADVANCED"] = "searchAdvanced";
})(Action = exports.Action || (exports.Action = {}));
// #endregion RPC Constants
// #region Create
class CreateIndexRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.name = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
        this.price = undefined;
        this.color = undefined;
        this.branchIds = undefined;
        this.branches = undefined;
        this.categoryId = undefined;
        this.category = undefined;
        this.status = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.array({
        items: joi.string().regex(/\d+/).required(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], CreateIndexRequest.prototype, "branchIds", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.object(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], CreateIndexRequest.prototype, "branches", void 0);
exports.CreateIndexRequest = CreateIndexRequest;
class CreateIndexResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.createdAt = undefined;
    }
}
exports.CreateIndexResponse = CreateIndexResponse;
// #endregion Create
// #region Delete
class DeleteIndexRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.ids = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.array({
        items: joi.string().regex(/\d+/).required(),
        allowSingle: true,
        maxLength: 10,
    }),
    __metadata("design:type", Array)
], DeleteIndexRequest.prototype, "ids", void 0);
exports.DeleteIndexRequest = DeleteIndexRequest;
class DeleteIndexResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.deletedAt = undefined;
    }
}
exports.DeleteIndexResponse = DeleteIndexResponse;
// #endregion Delete
// #region Edit
class EditIndexRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.id = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
        this.name = undefined;
        this.price = undefined;
        this.color = undefined;
        this.branchIds = undefined;
        this.branches = undefined;
        this.categoryId = undefined;
        this.category = undefined;
        this.status = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.array({
        items: joi.string().regex(/\d+/).required(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], EditIndexRequest.prototype, "branchIds", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.object(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], EditIndexRequest.prototype, "branches", void 0);
exports.EditIndexRequest = EditIndexRequest;
class EditIndexResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.updatedAt = undefined;
    }
}
exports.EditIndexResponse = EditIndexResponse;
// #endregion Edit
// #region Search advanced
class SearchAdvancedRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.name = undefined;
        this.price = undefined;
        this.color = undefined;
        this.branchIds = undefined;
        this.branches = undefined;
        this.categoryId = undefined;
        this.category = undefined;
        this.status = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.array({
        items: joi.string().regex(/\d+/).required(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], SearchAdvancedRequest.prototype, "branchIds", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.object(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], SearchAdvancedRequest.prototype, "branches", void 0);
exports.SearchAdvancedRequest = SearchAdvancedRequest;
class SearchAdvancedResponse extends dto_base_1.MaybeResponse {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.name = undefined;
        this.price = undefined;
        this.color = undefined;
        this.status = undefined;
        this.category = undefined;
        this.branches = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }
}
exports.SearchAdvancedResponse = SearchAdvancedResponse;
// #endregion Search advanced
//# sourceMappingURL=search.js.map