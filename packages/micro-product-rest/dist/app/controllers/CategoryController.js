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
const debug = require('debug')('nab:ctrl:category');
const common_1 = require("@micro-fleet/common");
const web_1 = require("@micro-fleet/web");
const Types_1 = require("../constants/Types");
const dto = require("../contracts/dto/category");
let CategoryController = class CategoryController extends web_1.RestControllerBase {
    constructor(_categorySvc) {
        super();
        this._categorySvc = _categorySvc;
        debug('CategoryController instantiated');
    }
    /**
     * GET {prefix}/categories/:id?fields=prop
     * @example /api/v1/categories/123654?fields=id&fields=name
     */
    getOne(params) {
        return this._categorySvc.getById(params);
    }
    /**
     * GET {prefix}/categories/
     * @example /api/v1/categories?pageIndex=2&pageSize=10&sortBy=name&sortType=desc
     */
    getList(params) {
        return this._categorySvc.getList(params);
    }
    /**
     * POST {prefix}/categories
     * @example /api/v1/categories
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
        return this._categorySvc.create(params);
    }
    /**
     * PATCH {prefix}/categories
     * @example /api/v1/categories
     *
     * {
     *	id: '123498765',
     *	name: 'Nemo Doe',
     * }
     */
    edit(params) {
        return this._categorySvc.edit(params);
    }
    /**
     * DELETE {prefix}/categories/:ids
     * @example /api/v1/categories/123654
     */
    deleteSingle(params) {
        return this._categorySvc.hardDeleteSingle(params);
    }
    /**
     * DELETE {prefix}/categories
     * @example /api/v1/categories?ids=123&ids=456&ids=789
     */
    deleteMany(params) {
        return this._categorySvc.hardDeleteMany(params);
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
    __metadata("design:paramtypes", [dto.GetCategoryByIdRequest]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getOne", null);
__decorate([
    web_1.decorators.GET('/'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.query,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.GetCategoryListRequest]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getList", null);
__decorate([
    web_1.decorators.POST('/'),
    __param(0, web_1.decorators.model()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.CreateCategoryRequest]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    web_1.decorators.PATCH('/'),
    __param(0, web_1.decorators.model({ isPartial: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.EditCategoryRequest]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "edit", null);
__decorate([
    web_1.decorators.DELETE(':ids'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.params,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.DeleteCategoryRequest]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "deleteSingle", null);
__decorate([
    web_1.decorators.DELETE('/'),
    __param(0, web_1.decorators.model({
        extractFn: (r) => r.query,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto.DeleteCategoryRequest]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "deleteMany", null);
CategoryController = __decorate([
    web_1.decorators.controller('categories'),
    __param(0, common_1.decorators.inject(Types_1.Types.CATEGORY_SVC)),
    __metadata("design:paramtypes", [Object])
], CategoryController);
exports.default = CategoryController;
//# sourceMappingURL=CategoryController.js.map