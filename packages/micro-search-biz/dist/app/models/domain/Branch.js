"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = void 0;
const common_1 = require("@micro-fleet/common");
const date_utils_1 = require("../../utils/date-utils");
class Branch extends common_1.Translatable {
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
exports.Branch = Branch;
//# sourceMappingURL=Branch.js.map