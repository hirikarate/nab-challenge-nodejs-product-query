"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const common_1 = require("@micro-fleet/common");
const date_utils_1 = require("../../utils/date-utils");
const Branch_1 = require("./Branch");
const Category_1 = require("./Category");
class Product extends common_1.Translatable {
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
    static $createTranslator() {
        return new ProductTranslator();
    }
    get createdMoment() {
        return date_utils_1.momentify(this.createdAt);
    }
    get updatedMoment() {
        return this.updatedAt ? date_utils_1.momentify(this.updatedAt) : null;
    }
}
exports.Product = Product;
class ProductTranslator extends common_1.ModelAutoMapper {
    constructor() {
        super(Product);
    }
    /**
     * @override
     */
    $createMap() {
        return super
            .$createMap()
            .forMember('branches', function ({ sourceObject, sourcePropertyName }) {
            const { branchIds } = sourceObject;
            // If converting from request object
            if (Array.isArray(branchIds)) {
                return branchIds.map((id) => ({ id }));
            }
            // If converting from ORM object
            return Branch_1.Branch.from(sourceObject[sourcePropertyName]);
        })
            .forMember('category', function ({ sourceObject, sourcePropertyName }) {
            return Category_1.Category.from(sourceObject[sourcePropertyName]);
        });
    }
}
//# sourceMappingURL=Product.js.map