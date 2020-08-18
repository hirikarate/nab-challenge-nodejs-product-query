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
exports.SearchResponse = exports.SearchResultItem = exports.SearchAdvancedRequest = exports.FilterRequest = exports.EditIndexResponse = exports.EditIndexRequest = exports.DeleteIndexResponse = exports.DeleteIndexRequest = exports.CreateIndexResponse = exports.CreateIndexRequest = exports.Action = exports.MODULE_NAME = void 0;
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
    Action["FILTER"] = "filter";
    Action["SEARCH_ADVANCED"] = "searchAdvanced";
})(Action = exports.Action || (exports.Action = {}));
// #endregion RPC Constants
// #region Create
class CreateIndexRequest extends common_1.Translatable {
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
    common_1.decorators.string(),
    __metadata("design:type", String)
], CreateIndexRequest.prototype, "id", void 0);
__decorate([
    common_1.decorators.string(),
    __metadata("design:type", String)
], CreateIndexRequest.prototype, "name", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", Number)
], CreateIndexRequest.prototype, "price", void 0);
__decorate([
    common_1.decorators.string(),
    __metadata("design:type", String)
], CreateIndexRequest.prototype, "color", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.string().regex(/^\d+$/).required(),
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
__decorate([
    common_1.decorators.string(),
    __metadata("design:type", String)
], CreateIndexRequest.prototype, "categoryId", void 0);
__decorate([
    common_1.decorators.validateProp(joi.object()),
    __metadata("design:type", Object)
], CreateIndexRequest.prototype, "category", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", Number)
], CreateIndexRequest.prototype, "status", void 0);
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
        items: joi.string().regex(/^\d+$/).required(),
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
        this.id = undefined;
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
    common_1.decorators.string(),
    __metadata("design:type", String)
], EditIndexRequest.prototype, "id", void 0);
__decorate([
    common_1.decorators.string(),
    __metadata("design:type", String)
], EditIndexRequest.prototype, "name", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", Number)
], EditIndexRequest.prototype, "price", void 0);
__decorate([
    common_1.decorators.string(),
    __metadata("design:type", String)
], EditIndexRequest.prototype, "color", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.string().regex(/^\d+$/).required(),
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
__decorate([
    common_1.decorators.string(),
    __metadata("design:type", String)
], EditIndexRequest.prototype, "categoryId", void 0);
__decorate([
    common_1.decorators.validateProp(joi.object()),
    __metadata("design:type", Object)
], EditIndexRequest.prototype, "category", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", Number)
], EditIndexRequest.prototype, "status", void 0);
exports.EditIndexRequest = EditIndexRequest;
class EditIndexResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.updatedAt = undefined;
    }
}
exports.EditIndexResponse = EditIndexResponse;
// #endregion Edit
// #region Search
class FilterRequest extends dto_base_1.GetListRequestBase {
    constructor() {
        super(...arguments);
        this.name = undefined;
        this.maxPrice = undefined;
        this.minPrice = undefined;
        this.color = undefined;
        this.branchIds = undefined;
        this.categoryIds = undefined;
        this.status = undefined;
        this.viewer = undefined;
        this.sortBy = undefined;
    }
}
__decorate([
    common_1.decorators.string(),
    __metadata("design:type", String)
], FilterRequest.prototype, "name", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", Number)
], FilterRequest.prototype, "maxPrice", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", Number)
], FilterRequest.prototype, "minPrice", void 0);
__decorate([
    common_1.decorators.string(),
    __metadata("design:type", String)
], FilterRequest.prototype, "color", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.string().regex(/^\d+$/).required(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], FilterRequest.prototype, "branchIds", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.string().required(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], FilterRequest.prototype, "categoryIds", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", String)
], FilterRequest.prototype, "status", void 0);
__decorate([
    common_1.decorators.validateProp(joi.object()),
    __metadata("design:type", Object)
], FilterRequest.prototype, "viewer", void 0);
__decorate([
    common_1.decorators.string(),
    common_1.decorators.valid('name', 'price', 'createdAt'),
    __metadata("design:type", String)
], FilterRequest.prototype, "sortBy", void 0);
exports.FilterRequest = FilterRequest;
class SearchAdvancedRequest extends dto_base_1.GetListRequestBase {
    constructor() {
        super(...arguments);
        this.keywords = undefined;
        this.maxPrice = undefined;
        this.minPrice = undefined;
        this.branchIds = undefined;
        this.categoryIds = undefined;
        this.status = undefined;
        this.viewer = undefined;
        this.sortBy = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string(),
    __metadata("design:type", String)
], SearchAdvancedRequest.prototype, "keywords", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", Number)
], SearchAdvancedRequest.prototype, "maxPrice", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", Number)
], SearchAdvancedRequest.prototype, "minPrice", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.string().regex(/^\d+$/).required(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], SearchAdvancedRequest.prototype, "branchIds", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.string().required(),
        allowSingle: true,
    }),
    __metadata("design:type", String)
], SearchAdvancedRequest.prototype, "categoryIds", void 0);
__decorate([
    common_1.decorators.number(),
    __metadata("design:type", String)
], SearchAdvancedRequest.prototype, "status", void 0);
__decorate([
    common_1.decorators.validateProp(joi.object()),
    __metadata("design:type", Object)
], SearchAdvancedRequest.prototype, "viewer", void 0);
__decorate([
    common_1.decorators.string(),
    common_1.decorators.valid('name', 'price', 'createdAt'),
    __metadata("design:type", String)
], SearchAdvancedRequest.prototype, "sortBy", void 0);
exports.SearchAdvancedRequest = SearchAdvancedRequest;
class SearchResultItem extends common_1.Translatable {
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
exports.SearchResultItem = SearchResultItem;
class SearchResponse extends dto_base_1.DTOListBase {
    constructor(items = [], total = 0) {
        super(SearchResultItem, items, total);
    }
}
exports.SearchResponse = SearchResponse;
// #endregion Search
//# sourceMappingURL=search.js.map