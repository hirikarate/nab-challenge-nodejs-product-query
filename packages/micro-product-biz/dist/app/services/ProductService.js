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
const dto = require("../contracts/dto/product");
const Product_1 = require("../models/domain/Product");
const ManagementServiceBase_1 = require("./ManagementServiceBase");
let ProductService = class ProductService extends ManagementServiceBase_1.ManagementServiceBase {
    constructor(sessionFactory, repo, _idGen) {
        super(Product_1.Product, repo, sessionFactory);
        this._idGen = _idGen;
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
        }, dto.CreateProductResponse);
    }
    /**
     * @override
     */
    $checkCreateViolation(params) {
        if (params.name.toLocaleLowerCase().split(' ').includes('shit')) {
            return Promise.resolve(common_1.Maybe.Just('PRODUCT_NAME_WITH_BANNED_WORDS'));
        }
        return Promise.resolve(common_1.Maybe.Nothing());
    }
    // #endregion Create
    /**
     * @see IProductRepository.edit
     */
    edit(params) {
        return this.$edit(params, dto.EditProductResponse);
    }
    /**
     * @see IProductRepository.hardDeleteSingle
     */
    hardDeleteSingle(params) {
        return this.$hardDeleteSingle(params, dto.DeleteProductResponse);
    }
    /**
     * @see IProductRepository.hardDeleteMany
     */
    hardDeleteMany(params) {
        return this.$hardDeleteMany(params, dto.DeleteProductResponse);
    }
    /**
     * @see IProductRepository.getById
     */
    getById(params) {
        return this.$getById(params, dto.GetSingleProductResponse);
    }
    /**
     * @see IProductRepository.getList
     */
    getList(params) {
        return this.$getList(params, dto.GetProductListResponse);
    }
    /**
     * @see IProductRepository.getRecalledList
     */
    async getRecalledList(params) {
        const fetchedDomainModels = await this._productRepo.pageRecalled(params);
        if (fetchedDomainModels.length) {
            const result = dto.GetProductListResponse.from(fetchedDomainModels);
            return result;
        }
        return new dto.GetProductListResponse();
    }
};
ProductService = __decorate([
    __param(0, common_1.decorators.inject(persistence_1.Types.ATOMIC_SESSION_FACTORY)),
    __param(1, common_1.decorators.inject(Types_1.Types.PRODUCT_REPO)),
    __param(2, common_1.decorators.inject(id_generator_1.Types.ID_PROVIDER)),
    __metadata("design:paramtypes", [persistence_1.AtomicSessionFactory, Object, Object])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map