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
exports.CategoryService = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:svc:category');
const common_1 = require("@micro-fleet/common");
const id_generator_1 = require("@micro-fleet/id-generator");
const persistence_1 = require("@micro-fleet/persistence");
const Types_1 = require("../constants/Types");
const dto = require("../contracts/dto/category");
const Category_1 = require("../models/domain/Category");
const ManagementServiceBase_1 = require("./ManagementServiceBase");
let CategoryService = class CategoryService extends ManagementServiceBase_1.ManagementServiceBase {
    constructor(sessionFactory, repo, _idGen) {
        super(Category_1.Category, repo, sessionFactory);
        this._idGen = _idGen;
        debug('CategoryService instantiated');
    }
    // #region Create
    /**
     * @see ICategoryService.create
     */
    create(params) {
        return this.$create({
            ...params,
            id: this._idGen.nextBigInt().toString(),
        }, dto.CreateCategoryResponse);
    }
    /**
     * @override
     */
    async $checkCreateViolation(params) {
        if (await this.$repo.exists({ name: params.name })) {
            return common_1.Maybe.Just('CATEGORY_NAME_ALREADY_EXISTS');
        }
        return common_1.Maybe.Nothing();
    }
    // #endregion Create
    /**
     * @see ICategoryService.edit
     */
    edit(params) {
        return this.$edit(params, dto.EditCategoryResponse);
    }
    /**
     * @see ICategoryService.hardDeleteSingle
     */
    hardDeleteSingle(params) {
        return this.$hardDeleteSingle(params, dto.DeleteCategoryResponse);
    }
    /**
     * @see ICategoryService.hardDeleteMany
     */
    hardDeleteMany(params) {
        return this.$hardDeleteMany(params, dto.DeleteCategoryResponse);
    }
    /**
     * @see ICategoryService.getById
     */
    getById(params) {
        return this.$getById(params, dto.GetSingleCategoryResponse);
    }
    /**
     * @see ICategoryService.getList
     */
    getList(params) {
        debug('CategoryService.getList');
        return this.$getList(params, dto.GetCategoryListResponse);
    }
};
CategoryService = __decorate([
    __param(0, common_1.decorators.inject(persistence_1.Types.ATOMIC_SESSION_FACTORY)),
    __param(1, common_1.decorators.inject(Types_1.Types.CATEGORY_REPO)),
    __param(2, common_1.decorators.inject(id_generator_1.Types.ID_PROVIDER)),
    __metadata("design:paramtypes", [persistence_1.AtomicSessionFactory, Object, Object])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=CategoryService.js.map