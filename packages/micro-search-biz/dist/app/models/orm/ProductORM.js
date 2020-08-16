"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProductORM_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductORM = void 0;
const objection_1 = require("objection");
const common_1 = require("@micro-fleet/common");
const persistence_1 = require("@micro-fleet/persistence");
const date_utils_1 = require("../../utils/date-utils");
const BranchORM_1 = require("./BranchORM");
const CategoryORM_1 = require("./CategoryORM");
let ProductORM = ProductORM_1 = class ProductORM extends persistence_1.ORMModelBase {
    constructor() {
        super(...arguments);
        this.id = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
        this.categoryId = undefined;
        this.name = undefined;
        this.price = undefined;
        this.color = undefined;
        this.status = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
        this.category = undefined;
        this.branches = undefined;
    }
    /**
     * @override
     */
    static get tableName() {
        return 'public.nab_products';
    }
    /**
     * [ObjectionJS]
     */
    $beforeInsert(queryContext) {
        void super.$beforeInsert(queryContext);
        this.createdAt = date_utils_1.momentify().format();
    }
    /**
     * [ObjectionJS]
     */
    $beforeUpdate(opt, queryContext) {
        void super.$beforeUpdate(opt, queryContext);
        this.updatedAt = date_utils_1.momentify().format();
    }
    /**
     * [ObjectionJS]
     * This method converts the JSON object from the database format
     * to the entity class.
     */
    $parseDatabaseJson(json) {
        const entityProps = super.$parseDatabaseJson(json);
        return {
            ...entityProps,
            createdAt: date_utils_1.toUtcTimeString(json.createdAt),
            updatedAt: date_utils_1.toUtcTimeString(json.updatedAt),
        };
    }
};
ProductORM.relationMappings = {
    branches: {
        relation: objection_1.Model.ManyToManyRelation,
        modelClass: BranchORM_1.BranchORM,
        join: {
            from: `${ProductORM_1.tableName}.id`,
            through: {
                from: 'nab_product_branch.productId',
                to: 'nab_product_branch.branchId',
            },
            to: `${BranchORM_1.BranchORM.tableName}.id`,
        },
    },
    category: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: CategoryORM_1.CategoryORM,
        join: {
            from: `${ProductORM_1.tableName}.categoryId`,
            to: `${CategoryORM_1.CategoryORM.tableName}.id`,
        },
    },
};
ProductORM = ProductORM_1 = __decorate([
    common_1.decorators.translatable()
], ProductORM);
exports.ProductORM = ProductORM;
//# sourceMappingURL=ProductORM.js.map