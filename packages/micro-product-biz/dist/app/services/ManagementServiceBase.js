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
exports.ManagementServiceBase = void 0;
const common_1 = require("@micro-fleet/common");
const p = require("@micro-fleet/persistence");
const date_utils_1 = require("../utils/date-utils");
/**
 * Provides methods for common CRUD operations
 */
let ManagementServiceBase = class ManagementServiceBase {
    constructor($DomainClass, $repo, $sessionFactory) {
        this.$DomainClass = $DomainClass;
        this.$repo = $repo;
        this.$sessionFactory = $sessionFactory;
    }
    // #region Create
    async $create(params, ResponseClass, options) {
        const violation = await this.$checkCreateViolation(params);
        if (violation.isJust) {
            return new ResponseClass(false, violation.value);
        }
        const newDomainModel = this.$DomainClass.from(params);
        const createdDomainModel = await this.$repo.create(newDomainModel, options);
        const result = ResponseClass.from(createdDomainModel);
        return result;
    }
    /**
     * Can be overriden by derived class to check business rule for creating.
     */
    $checkCreateViolation(_params) {
        return Promise.resolve(common_1.Maybe.Nothing());
    }
    // #endregion Create
    // #region Delete
    async $hardDeleteSingle(params, ResponseClass, options) {
        const violation = await this.$checkDeleteSingleViolation(params);
        if (violation.isJust) {
            return new ResponseClass(false, violation.value);
        }
        const id = new common_1.SingleId(params.ids[0]);
        const affectedCount = await this.$repo.deleteSingle(id, options);
        if (affectedCount) {
            const result = ResponseClass.from({
                ids: params.ids,
                deletedAt: date_utils_1.momentify().format(),
            });
            return result;
        }
        return new ResponseClass(false);
    }
    /**
     * Can be overriden by derived class to check business rule for deleting.
     */
    $checkDeleteSingleViolation(_params) {
        return Promise.resolve(common_1.Maybe.Nothing());
    }
    async $hardDeleteMany(params, ResponseClass, options) {
        const violation = await this.$checkDeleteManyViolation(params);
        if (violation.isJust) {
            return new ResponseClass(false, violation.value);
        }
        const ids = params.ids.map(id => new common_1.SingleId(id));
        let task;
        if (options && options.atomicSession) {
            task = this.$repo.deleteMany(ids, options);
        }
        else if (params.isAtomic) {
            task = this.$sessionFactory.startSession()
                .pipe((atomicSession) => this.$repo.deleteMany(ids, { ...options, atomicSession }))
                .closePipe();
        }
        else {
            task = this.$repo.deleteMany(ids, options);
        }
        const affectedCount = await task;
        if (affectedCount) {
            const result = ResponseClass.from({
                ids: params.ids,
                deletedAt: date_utils_1.momentify().format(),
            });
            return result;
        }
        return new ResponseClass(false);
    }
    /**
     * Can be overriden by derived class to check business rule for deleting.
     */
    $checkDeleteManyViolation(_params) {
        return Promise.resolve(common_1.Maybe.Nothing());
    }
    // #endregion Delete
    // #region Edit
    async $edit(params, ResponseClass, options) {
        const violation = await this.$checkEditViolation(params);
        if (violation.isJust) {
            return new ResponseClass(false, violation.value);
        }
        const partialDomainModel = this.$DomainClass.from(params);
        const maybe = await this.$repo.patch(partialDomainModel, options);
        if (maybe.isJust) {
            const result = ResponseClass.from(maybe.value);
            return result;
        }
        return new ResponseClass(false);
    }
    /**
     * Can be overriden by derived class to check business rule for editing.
     */
    $checkEditViolation(_params) {
        return Promise.resolve(common_1.Maybe.Nothing());
    }
    // #endregion Edit
    // #region Get
    async $getById(params, ResponseClass, options) {
        const id = new common_1.SingleId(params.id);
        params.relations = this.$objectifyRelations(params.relations);
        const maybe = await this.$repo.findById(id, { ...params, ...options });
        if (maybe.isJust) {
            const result = ResponseClass.from(maybe.value);
            return result;
        }
        return new ResponseClass(false);
    }
    async $getList(params, ResponseClass, options) {
        params.relations = this.$objectifyRelations(params.relations);
        const fetchedDomainModels = await this.$repo.page({ ...params, ...options });
        if (fetchedDomainModels.length) {
            const result = ResponseClass.from(fetchedDomainModels);
            return result;
        }
        return new ResponseClass();
    }
    // #endregion Get
    /**
     * Converts string array to Objection's relation expression
     * @example
     *
     * Input: ['tenant', 'category']
     * Output: {
     *   tenant: true,
     *   category: true,
     * }
     *
     * Input: ['tenant', 'product.producer']
     * Output: {
     *   tenant: true,
     *   product: {
     *      producer: true,
     *   },
     * }
     */
    $objectifyRelations(relations) {
        if (!relations) {
            return null;
        }
        return relations.reduce((relationObj, currentRelation) => {
            const nestedRelations = currentRelation.split('.');
            let relation = {};
            nestedRelations.reduce((prev, cur, index) => {
                if (index === 0) {
                    relation = prev;
                }
                prev[cur] = (index === nestedRelations.length - 1) ? true : {};
                return prev[cur];
            }, {});
            return {
                ...relationObj,
                ...relation,
            };
        }, {});
    }
};
ManagementServiceBase = __decorate([
    common_1.decorators.injectable(),
    __param(0, common_1.decorators.unmanaged()),
    __param(1, common_1.decorators.unmanaged()),
    __param(2, common_1.decorators.unmanaged()),
    __metadata("design:paramtypes", [Object, Object, p.AtomicSessionFactory])
], ManagementServiceBase);
exports.ManagementServiceBase = ManagementServiceBase;
//# sourceMappingURL=ManagementServiceBase.js.map