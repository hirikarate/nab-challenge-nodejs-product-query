"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BranchController_1 = require("./BranchController");
const CategoryController_1 = require("./CategoryController");
const ProductController_1 = require("./ProductController");
const ProductSearchController_1 = require("./ProductSearchController");
module.exports = {
    BranchController: BranchController_1.default,
    CategoryController: CategoryController_1.default,
    ProductSearchController: ProductSearchController_1.default,
    ProductController: // Must be above ProductController
    ProductController_1.default,
};
//# sourceMappingURL=index.js.map