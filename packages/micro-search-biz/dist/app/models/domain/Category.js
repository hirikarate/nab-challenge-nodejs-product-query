"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const common_1 = require("@micro-fleet/common");
const date_utils_1 = require("../../utils/date-utils");
class Category extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.id = undefined; // Must be initialized, otherwise TypeScript compiler will remove it
        this.name = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
    }
    get createdMoment() {
        return date_utils_1.momentify(this.createdAt);
    }
    get updatedMoment() {
        return this.updatedAt ? date_utils_1.momentify(this.updatedAt) : null;
    }
}
exports.Category = Category;
//# sourceMappingURL=Category.js.map