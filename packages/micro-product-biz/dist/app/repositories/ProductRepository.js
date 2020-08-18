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
exports.ProductRepository = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:repo:product');
const common_1 = require("@micro-fleet/common");
const p = require("@micro-fleet/persistence");
const constants_shared_1 = require("../contracts/constants-shared");
const Product_1 = require("../models/domain/Product");
const ProductORM_1 = require("../models/orm/ProductORM");
let ProductRepository = class ProductRepository extends p.PgCrudRepositoryBase {
    constructor(
    /* eslint-disable-next-line @typescript-eslint/indent */
    connector) {
        super(ProductORM_1.ProductORM, Product_1.Product, connector);
        debug('ProductRepository instantiated');
    }
    /**
     * @see IRepository.create
     */
    create(domainModel, opts = {}) {
        const promise = super.create(domainModel, opts)
		return promise.then((responses) => {
				return responses[0]
			}); // `query.insertGraph` always returns an array
    }
    /**
     * @override
     */
    $buildCreateQuery(query, model, ormModel) {
        const q = query.insertGraph([ormModel], { relate: true });
        return q.returning('*');
    }
    /**
     * @override
     */
    $buildPatchQuery(query, model, ormModel) {
        const q = query.upsertGraph([ormModel], { relate: true, unrelate: true, insertMissing: false });
        return q.returning('*');
    }
    /**
     * @see IRepository.pageActive
     */
    async pageRecalled(opts) {
        const foundList = await this.$executeQuery((query) => {
            const q = this._buildPageWithFilter(query, opts);
            debug('PAGE RECALLED: %s', q.toSql());
            return q;
        }, opts.atomicSession);
        if (!foundList) {
            return new common_1.PagedData();
        }
        const dtoList = this.$toDomainModelMany(foundList.results);
        return new common_1.PagedData(dtoList, foundList.total);
    }
    /**
     * @override
     */
    _buildPageWithFilter(query, opts) {
        const q = super.$buildPageQuery(query, opts);
        void q.where('status', constants_shared_1.ProductStatus.RECALLED);
        return q;
    }
};
ProductRepository = __decorate([
    __param(0, common_1.decorators.inject(p.Types.DB_CONNECTOR)),
    __metadata("design:paramtypes", [Object])
], ProductRepository);
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map