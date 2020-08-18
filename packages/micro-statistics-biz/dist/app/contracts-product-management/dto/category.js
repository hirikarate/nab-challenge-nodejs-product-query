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
exports.GetCategoryListResponse = exports.CategoryListItem = exports.GetCategoryListRequest = exports.GetSingleCategoryResponse = exports.GetCategoryByIdRequest = exports.EditCategoryResponse = exports.EditCategoryRequest = exports.DeleteCategoryResponse = exports.DeleteCategoryRequest = exports.CreateCategoryResponse = exports.CreateCategoryRequest = exports.Action = exports.MODULE_NAME = void 0;
const joi = require("@hapi/joi");
const common_1 = require("@micro-fleet/common");
const dto_base_1 = require("./dto-base");
// #region RPC Constants
exports.MODULE_NAME = 'nabCategoryManagement';
var Action;
(function (Action) {
    Action["CREATE"] = "create";
    Action["EDIT"] = "edit";
    Action["HARD_DELETE"] = "hardDelete";
    Action["GET_BY_ID"] = "getById";
    Action["GET_LIST"] = "getList";
    Action["GET_RECALLED_LIST"] = "getRecalledList";
})(Action = exports.Action || (exports.Action = {}));
// #endregion RPC Constants
const CATEGORY_FIELDS = ['id', 'name', 'createdAt', 'updatedAt'];
const FIELDS_RULE = { items: joi.string().valid(...CATEGORY_FIELDS) };
// #region Create
class CreateCategoryRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.name = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ minLength: 3, maxLength: 100 }),
    __metadata("design:type", String)
], CreateCategoryRequest.prototype, "name", void 0);
exports.CreateCategoryRequest = CreateCategoryRequest;
class CreateCategoryResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.createdAt = undefined;
    }
}
exports.CreateCategoryResponse = CreateCategoryResponse;
// #endregion Create
// #region Delete
class DeleteCategoryRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.ids = undefined;
        /**
         * If `true`, when failed to delete one ID, the whole operation is
         * considered failure, all changes are rolled back.
         */
        this.isAtomic = undefined;
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
], DeleteCategoryRequest.prototype, "ids", void 0);
__decorate([
    common_1.decorators.defaultAs(true),
    common_1.decorators.boolean(),
    __metadata("design:type", Boolean)
], DeleteCategoryRequest.prototype, "isAtomic", void 0);
exports.DeleteCategoryRequest = DeleteCategoryRequest;
class DeleteCategoryResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.deletedAt = undefined;
    }
}
exports.DeleteCategoryResponse = DeleteCategoryResponse;
// #endregion Delete
// #region Edit
class EditCategoryRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.id = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
        this.name = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.bigint(),
    __metadata("design:type", String)
], EditCategoryRequest.prototype, "id", void 0);
__decorate([
    common_1.decorators.string({ minLength: 3, maxLength: 100 }),
    __metadata("design:type", String)
], EditCategoryRequest.prototype, "name", void 0);
exports.EditCategoryRequest = EditCategoryRequest;
class EditCategoryResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.updatedAt = undefined;
    }
}
exports.EditCategoryResponse = EditCategoryResponse;
// #endregion Edit
// #region Get by ID
class GetCategoryByIdRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.fields = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.bigint(),
    __metadata("design:type", String)
], GetCategoryByIdRequest.prototype, "id", void 0);
__decorate([
    common_1.decorators.array(FIELDS_RULE),
    __metadata("design:type", Array)
], GetCategoryByIdRequest.prototype, "fields", void 0);
exports.GetCategoryByIdRequest = GetCategoryByIdRequest;
class GetSingleCategoryResponse extends dto_base_1.MaybeResponse {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.name = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }
}
exports.GetSingleCategoryResponse = GetSingleCategoryResponse;
// #endregion Get by ID
// #region Get List
class GetCategoryListRequest extends dto_base_1.GetListRequestBase {
    constructor() {
        super(...arguments);
        this.fields = undefined;
        this.sortBy = undefined;
    }
}
__decorate([
    common_1.decorators.array(FIELDS_RULE),
    __metadata("design:type", Array)
], GetCategoryListRequest.prototype, "fields", void 0);
__decorate([
    common_1.decorators.string({ maxLength: 50 }),
    common_1.decorators.valid('name', 'createdAt', 'updatedAt'),
    __metadata("design:type", String)
], GetCategoryListRequest.prototype, "sortBy", void 0);
exports.GetCategoryListRequest = GetCategoryListRequest;
class CategoryListItem extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.name = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }
}
exports.CategoryListItem = CategoryListItem;
class GetCategoryListResponse extends dto_base_1.DTOListBase {
    constructor(products = [], total = 0) {
        super(CategoryListItem, products, total);
    }
}
exports.GetCategoryListResponse = GetCategoryListResponse;
// #endregion Get List
//# sourceMappingURL=category.js.map