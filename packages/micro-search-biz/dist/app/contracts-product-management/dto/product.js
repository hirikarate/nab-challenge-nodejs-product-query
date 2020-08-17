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
exports.GetProductListResponse = exports.ProductListItem = exports.GetProductListRequest = exports.GetSingleProductResponse = exports.GetProductByIdRequest = exports.EditProductResponse = exports.EditProductRequest = exports.DeleteProductResponse = exports.DeleteProductRequest = exports.CreateProductResponse = exports.CreateProductRequest = exports.PRODUCT_RELATIONS = exports.PRODUCT_FIELDS = exports.Action = exports.MODULE_NAME = void 0;
const joi = require("@hapi/joi");
const common_1 = require("@micro-fleet/common");
const dto_base_1 = require("./dto-base");
const constants_shared_1 = require("../constants-shared");
// #region RPC Constants
exports.MODULE_NAME = 'nabProductManagement';
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
exports.PRODUCT_FIELDS = ['id', 'name', 'price', 'color', 'status', 'categoryId',
    'createdAt', 'updatedAt'];
const FIELDS_RULE = { items: joi.string().valid(...exports.PRODUCT_FIELDS) };
exports.PRODUCT_RELATIONS = ['branches', 'category'];
const RELATIONS_RULE = {
    items: joi
        .string()
        .valid(...exports.PRODUCT_RELATIONS)
        .min(1),
};
// #region Create
class CreateProductRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.name = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
        this.price = undefined;
        this.color = undefined;
        this.branchIds = undefined;
        this.categoryId = undefined;
        this.status = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ minLength: 3, maxLength: 100 }),
    __metadata("design:type", String)
], CreateProductRequest.prototype, "name", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.number({ min: 0, max: 100e6 }),
    __metadata("design:type", Number)
], CreateProductRequest.prototype, "price", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ minLength: 3, maxLength: 50 }),
    __metadata("design:type", String)
], CreateProductRequest.prototype, "color", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.array({
        items: joi.string().regex(/\d+/).required(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], CreateProductRequest.prototype, "branchIds", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.bigint(),
    __metadata("design:type", String)
], CreateProductRequest.prototype, "categoryId", void 0);
__decorate([
    common_1.decorators.defaultAs(constants_shared_1.ProductStatus.ON_SALE),
    common_1.decorators.valid(constants_shared_1.ProductStatus.NOT_ON_SALE, constants_shared_1.ProductStatus.ON_SALE, constants_shared_1.ProductStatus.RECALLED),
    __metadata("design:type", Number)
], CreateProductRequest.prototype, "status", void 0);
exports.CreateProductRequest = CreateProductRequest;
class CreateProductResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.createdAt = undefined;
    }
}
exports.CreateProductResponse = CreateProductResponse;
// #endregion Create
// #region Delete
class DeleteProductRequest extends common_1.Translatable {
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
        items: joi.string().regex(/\d+/).required(),
        allowSingle: true,
        maxLength: 10,
    }),
    __metadata("design:type", Array)
], DeleteProductRequest.prototype, "ids", void 0);
__decorate([
    common_1.decorators.defaultAs(true),
    common_1.decorators.boolean(),
    __metadata("design:type", Boolean)
], DeleteProductRequest.prototype, "isAtomic", void 0);
exports.DeleteProductRequest = DeleteProductRequest;
class DeleteProductResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.ids = undefined;
        this.deletedAt = undefined;
    }
}
exports.DeleteProductResponse = DeleteProductResponse;
// #endregion Delete
// #region Edit
class EditProductRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.id = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
        this.name = undefined;
        this.price = undefined;
        this.color = undefined;
        this.branchIds = undefined;
        this.categoryId = undefined;
        this.status = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.bigint(),
    __metadata("design:type", String)
], EditProductRequest.prototype, "id", void 0);
__decorate([
    common_1.decorators.string({ minLength: 3, maxLength: 100 }),
    __metadata("design:type", String)
], EditProductRequest.prototype, "name", void 0);
__decorate([
    common_1.decorators.number({ min: 0, max: 100e6 }),
    __metadata("design:type", Number)
], EditProductRequest.prototype, "price", void 0);
__decorate([
    common_1.decorators.string({ minLength: 3, maxLength: 50 }),
    __metadata("design:type", String)
], EditProductRequest.prototype, "color", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.string().regex(/\d+/).required(),
        allowSingle: true,
    }),
    __metadata("design:type", Array)
], EditProductRequest.prototype, "branchIds", void 0);
__decorate([
    common_1.decorators.bigint(),
    __metadata("design:type", String)
], EditProductRequest.prototype, "categoryId", void 0);
__decorate([
    common_1.decorators.valid(constants_shared_1.ProductStatus.NOT_ON_SALE, constants_shared_1.ProductStatus.ON_SALE, constants_shared_1.ProductStatus.RECALLED),
    __metadata("design:type", String)
], EditProductRequest.prototype, "status", void 0);
exports.EditProductRequest = EditProductRequest;
class EditProductResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.updatedAt = undefined;
    }
}
exports.EditProductResponse = EditProductResponse;
// #endregion Edit
// #region Get by ID
class GetProductByIdRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.fields = undefined;
        this.relations = undefined;
        this.viewer = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.bigint(),
    __metadata("design:type", String)
], GetProductByIdRequest.prototype, "id", void 0);
__decorate([
    common_1.decorators.array(FIELDS_RULE),
    __metadata("design:type", Array)
], GetProductByIdRequest.prototype, "fields", void 0);
__decorate([
    common_1.decorators.array(RELATIONS_RULE),
    __metadata("design:type", Array)
], GetProductByIdRequest.prototype, "relations", void 0);
__decorate([
    common_1.decorators.validateProp(joi.object()),
    __metadata("design:type", Object)
], GetProductByIdRequest.prototype, "viewer", void 0);
exports.GetProductByIdRequest = GetProductByIdRequest;
class GetSingleProductResponse extends dto_base_1.MaybeResponse {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.name = undefined;
        this.price = undefined;
        this.color = undefined;
        this.status = undefined;
        this.categoryId = undefined;
        this.category = undefined;
        this.branchIds = undefined;
        this.branches = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }
}
exports.GetSingleProductResponse = GetSingleProductResponse;
// #endregion Get by ID
// #region Get List
class GetProductListRequest extends dto_base_1.GetListRequestBase {
    constructor() {
        super(...arguments);
        this.fields = undefined;
        this.relations = undefined;
        this.sortBy = undefined;
    }
}
__decorate([
    common_1.decorators.array(FIELDS_RULE),
    __metadata("design:type", Array)
], GetProductListRequest.prototype, "fields", void 0);
__decorate([
    common_1.decorators.array(RELATIONS_RULE),
    __metadata("design:type", Array)
], GetProductListRequest.prototype, "relations", void 0);
__decorate([
    common_1.decorators.string({ maxLength: 50 }),
    common_1.decorators.valid('name', 'price', 'createdAt', 'updatedAt'),
    __metadata("design:type", String)
], GetProductListRequest.prototype, "sortBy", void 0);
exports.GetProductListRequest = GetProductListRequest;
class ProductListItem extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.name = undefined;
        this.price = undefined;
        this.color = undefined;
        this.status = undefined;
        this.categoryId = undefined;
        this.category = undefined;
        this.branchIds = undefined;
        this.branches = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }
}
exports.ProductListItem = ProductListItem;
class GetProductListResponse extends dto_base_1.DTOListBase {
    constructor(products = [], total = 0) {
        super(ProductListItem, products, total);
    }
}
exports.GetProductListResponse = GetProductListResponse;
// #endregion Get List
//# sourceMappingURL=product.js.map