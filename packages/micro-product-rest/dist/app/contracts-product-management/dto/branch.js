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
exports.GetBranchListResponse = exports.BranchListItem = exports.GetBranchListRequest = exports.GetSingleBranchResponse = exports.GetBranchByIdRequest = exports.EditBranchResponse = exports.EditBranchRequest = exports.DeleteBranchResponse = exports.DeleteBranchRequest = exports.CreateBranchResponse = exports.CreateBranchRequest = exports.Action = exports.MODULE_NAME = void 0;
const joi = require("@hapi/joi");
const common_1 = require("@micro-fleet/common");
const dto_base_1 = require("./dto-base");
// #region RPC Constants
exports.MODULE_NAME = 'nabBranchManagement';
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
const BRANCH_FIELDS = ['id', 'name', 'createdAt', 'updatedAt'];
const FIELDS_RULE = { items: joi.string().valid(...BRANCH_FIELDS) };
// #region Create
class CreateBranchRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.name = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ minLength: 3, maxLength: 100 }),
    __metadata("design:type", String)
], CreateBranchRequest.prototype, "name", void 0);
exports.CreateBranchRequest = CreateBranchRequest;
class CreateBranchResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.createdAt = undefined;
    }
}
exports.CreateBranchResponse = CreateBranchResponse;
// #endregion Create
// #region Delete
class DeleteBranchRequest extends common_1.Translatable {
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
], DeleteBranchRequest.prototype, "ids", void 0);
__decorate([
    common_1.decorators.defaultAs(true),
    common_1.decorators.boolean(),
    __metadata("design:type", Boolean)
], DeleteBranchRequest.prototype, "isAtomic", void 0);
exports.DeleteBranchRequest = DeleteBranchRequest;
class DeleteBranchResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.deletedAt = undefined;
    }
}
exports.DeleteBranchResponse = DeleteBranchResponse;
// #endregion Delete
// #region Edit
class EditBranchRequest extends common_1.Translatable {
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
], EditBranchRequest.prototype, "id", void 0);
__decorate([
    common_1.decorators.string({ minLength: 3, maxLength: 100 }),
    __metadata("design:type", String)
], EditBranchRequest.prototype, "name", void 0);
exports.EditBranchRequest = EditBranchRequest;
class EditBranchResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.updatedAt = undefined;
    }
}
exports.EditBranchResponse = EditBranchResponse;
// #endregion Edit
// #region Get by ID
class GetBranchByIdRequest extends common_1.Translatable {
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
], GetBranchByIdRequest.prototype, "id", void 0);
__decorate([
    common_1.decorators.array(FIELDS_RULE),
    __metadata("design:type", Array)
], GetBranchByIdRequest.prototype, "fields", void 0);
exports.GetBranchByIdRequest = GetBranchByIdRequest;
class GetSingleBranchResponse extends dto_base_1.MaybeResponse {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.name = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }
}
exports.GetSingleBranchResponse = GetSingleBranchResponse;
// #endregion Get by ID
// #region Get List
class GetBranchListRequest extends dto_base_1.GetListRequestBase {
    constructor() {
        super(...arguments);
        this.fields = undefined;
        this.sortBy = undefined;
    }
}
__decorate([
    common_1.decorators.array(FIELDS_RULE),
    __metadata("design:type", Array)
], GetBranchListRequest.prototype, "fields", void 0);
__decorate([
    common_1.decorators.string({ maxLength: 50 }),
    common_1.decorators.valid('name', 'createdAt', 'updatedAt'),
    __metadata("design:type", String)
], GetBranchListRequest.prototype, "sortBy", void 0);
exports.GetBranchListRequest = GetBranchListRequest;
class BranchListItem extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.name = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }
}
exports.BranchListItem = BranchListItem;
class GetBranchListResponse extends dto_base_1.DTOListBase {
    constructor(products = [], total = 0) {
        super(BranchListItem, products, total);
    }
}
exports.GetBranchListResponse = GetBranchListResponse;
// #endregion Get List
//# sourceMappingURL=branch.js.map