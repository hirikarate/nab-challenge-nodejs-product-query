"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchORM = void 0;
const common_1 = require("@micro-fleet/common");
const persistence_1 = require("@micro-fleet/persistence");
const date_utils_1 = require("../../utils/date-utils");
let BranchORM = class BranchORM extends persistence_1.ORMModelBase {
    constructor() {
        super(...arguments);
        this.id = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
        this.name = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }
    /**
     * @override
     */
    static get tableName() {
        return 'public.nab_branches';
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
BranchORM = __decorate([
    common_1.decorators.translatable()
], BranchORM);
exports.BranchORM = BranchORM;
//# sourceMappingURL=BranchORM.js.map