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
exports.ProductService = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:svc:product');
const common_1 = require("@micro-fleet/common");
const id_generator_1 = require("@micro-fleet/id-generator");
const persistence_1 = require("@micro-fleet/persistence");
const Types_1 = require("../constants/Types");
const bdto = require("../contracts/dto/branch");
const cdto = require("../contracts/dto/category");
const pdto = require("../contracts/dto/product");
const Product_1 = require("../models/domain/Product");
const ManagementServiceBase_1 = require("./ManagementServiceBase");
let ProductService = class ProductService extends ManagementServiceBase_1.ManagementServiceBase {
    constructor(sessionFactory, repo, _idGen, _branchSvc, _categorySvc) {
        super(Product_1.Product, repo, sessionFactory);
        this._idGen = _idGen;
        this._branchSvc = _branchSvc;
        this._categorySvc = _categorySvc;
        debug('ProductService instantiated');
    }
    get _productRepo() {
        return this.$repo;
    }
    // #region Create
    /**
     * @see IProductRepository.create
     */
    create(params) {
        return this.$create({
            ...params,
            id: this._idGen.nextBigInt().toString(),
        }, pdto.CreateProductResponse);
    }
    /**
     * @override
     */
    async $checkCreateViolation(params) {
        const maybeViolations = await Promise.all([
            this._checkNameViolation(params.name),
            this._checkBranchViolation(params.branchIds),
            this._checkCategoryViolation(params.categoryId),
        ]);
        const violations = maybeViolations.filter(mb => mb.isJust).map(mb => mb.value);
        return violations.length
            ? Promise.resolve(common_1.Maybe.Just(new common_1.BusinessInvariantError(violations)))
            : Promise.resolve(common_1.Maybe.Nothing());
    }
    // #endregion Create
    // #region Edit
    /**
     * @see IProductRepository.edit
     */
    edit(params) {
        return this.$edit(params, pdto.EditProductResponse);
    }
    /**
     * @override
     */
    $checkEditViolation(params) {
        return this.$checkCreateViolation(params);
    }
    // #endregion Edit
    /**
     * @see IProductRepository.hardDeleteSingle
     */
    hardDeleteSingle(params) {
        return this.$hardDeleteSingle(params, pdto.DeleteProductResponse);
    }
    /**
     * @see IProductRepository.hardDeleteMany
     */
    hardDeleteMany(params) {
        return this.$hardDeleteMany(params, pdto.DeleteProductResponse);
    }
    /**
     * @see IProductRepository.getById
     */
    getById(params) {
        return this.$getById(params, pdto.GetSingleProductResponse);
    }
    /**
     * @see IProductRepository.getList
     */
    getList(params) {
        return this.$getList(params, pdto.GetProductListResponse);
    }
    /**
     * @see IProductRepository.getRecalledList
     */
    async getRecalledList(params) {
        const fetchedDomainModels = await this._productRepo.pageRecalled(params);
        if (fetchedDomainModels.length) {
            const result = pdto.GetProductListResponse.from(fetchedDomainModels);
            return result;
        }
        return new pdto.GetProductListResponse();
    }
    async _checkNameViolation(productName) {
        if (productName.toLocaleLowerCase().split(' ').includes('shit')) {
            return Promise.resolve(common_1.Maybe.Just({
                message: 'PRODUCT_NAME_WITH_BANNED_WORDS',
                path: ['name'],
                value: productName,
            }));
        }
        return Promise.resolve(common_1.Maybe.Nothing());
    }
    async _checkCategoryViolation(categoryId) {
        const request = cdto.CheckCategoryExistingRequest.from({
            id: categoryId,
        });
        const response = await this._categorySvc.exists(request);
        return response.isExisting
            ? common_1.Maybe.Nothing()
            : common_1.Maybe.Just({
                message: 'CATEGORY_NOT_EXISTING',
                path: ['categoryId'],
                value: categoryId,
            });
    }
    async _checkBranchViolation(branchIds) {
        const existPromises = branchIds.map(id => this._branchSvc.exists(bdto.CheckBranchExistingRequest.from({ id })));
        const existMaybes = await Promise.all(existPromises);
        const nonexistIds = existMaybes
            .reduce((prev, mb, i) => {
            if (mb.isExisting)
                return prev;
            prev.push(branchIds[i]);
            return prev;
        }, []);
        return nonexistIds.length
            ? common_1.Maybe.Just({
                message: 'BRANCHES_NOT_EXISTING',
                path: ['branchIds'],
                value: nonexistIds,
            })
            : common_1.Maybe.Nothing();
    }
};
ProductService = __decorate([
    __param(0, common_1.decorators.inject(persistence_1.Types.ATOMIC_SESSION_FACTORY)),
    __param(1, common_1.decorators.inject(Types_1.Types.PRODUCT_REPO)),
    __param(2, common_1.decorators.inject(id_generator_1.Types.ID_PROVIDER)),
    __param(3, common_1.decorators.inject(Types_1.Types.BRANCH_SVC)),
    __param(4, common_1.decorators.inject(Types_1.Types.CATEGORY_SVC)),
    __metadata("design:paramtypes", [persistence_1.AtomicSessionFactory, Object, Object, Object, Object])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map