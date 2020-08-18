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
const debug = require('debug')('nab:ctrl:branch');
const common_1 = require("@micro-fleet/common");
const web_1 = require("@micro-fleet/web");
const Types_1 = require("../constants/Types");
const dto = require("../contracts-product-management/dto/branch");
const authorized_1 = require("../filters/authorized");
let BranchController = class BranchController extends web_1.RestControllerBase {
    constructor(_branchSvc) {
        super();
        this._branchSvc = _branchSvc;
        debug('BranchController instantiated');
    }
    /**
     * GET {prefix}/branches/:id?fields=prop
     * @example /api/v1/branches/123654?fields=id&fields=name
     */
    getOne(params) {
        return this._branchSvc.getById(params);
    }
    /**
     * GET {prefix}/branches/
     * @example /api/v1/branches?pageIndex=2&pageSize=10&sortBy=name&sortType=desc
     */
    getList(params) {
        return this._branchSvc.getList(params);
    }
    /**
     * POST {prefix}/branches
     * @example /api/v1/branches
     *
     * Request body for creating a single user:
     * {
     *	name: 'John Nemo',
     * }
     *
     * or
     *
     * {
     *	name: 'John Nemo',
     *	status: 'active',
     * }
     */
    async create(params) {
        return this._branchSvc.create(params);
    }
    /**
     * PATCH {prefix}/branches
     * @example /api/v1/branches
     *
     * {
     *	id: '123498765',
     *	name: 'Nemo Doe',
     * }
     */
    edit(params) {
        return this._branchSvc.edit(params);
    }
    /**
     * DELETE {prefix}/branches/:ids
     * @example /api/v1/branches/123654
     */
    deleteSingle(params) {
        return this._branchSvc.hardDeleteSingle(params);
    }
    /**
     * DELETE {prefix}/branches
     * @example /api/v1/branches?ids=123&ids=456&ids=789
     */
    deleteMany(params) {
        return this._branchSvc.hardDeleteMany(params);
    }
};
__decorate([
    web_1.decorators.GET(':id'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => ({
            id: r.params.id,
            ...r.query,
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetBranchByIdRequest]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "getOne", null);
__decorate([
    web_1.decorators.GET('/'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.query,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetBranchListRequest]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "getList", null);
__decorate([
    web_1.decorators.POST('/'),
    __param(0, web_1.decorators.model()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.CreateBranchRequest]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "create", null);
__decorate([
    web_1.decorators.PATCH('/'),
    __param(0, web_1.decorators.model({ isPartial: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.EditBranchRequest]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "edit", null);
__decorate([
    web_1.decorators.DELETE(':ids'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.params,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.DeleteBranchRequest]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "deleteSingle", null);
__decorate([
    web_1.decorators.DELETE('/'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.query,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.DeleteBranchRequest]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "deleteMany", null);
BranchController = __decorate([
    authorized_1.authorized(),
    web_1.decorators.controller('branches'),
    __param(0, common_1.decorators.inject(Types_1.Types.BRANCH_SVC)),
    __metadata("design:paramtypes", [Object])
], BranchController);
exports.default = BranchController;
//# sourceMappingURL=BranchController.js.map