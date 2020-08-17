"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStatus = exports.SortType = void 0;
// Do not use "SortType" in @micro-fleet/persistence because
// this file is copy to REST service which doesn't depends on @micro-fleet/persistence.
var SortType;
(function (SortType) {
    SortType["ASC"] = "asc";
    SortType["DESC"] = "desc";
})(SortType = exports.SortType || (exports.SortType = {}));
var ProductStatus;
(function (ProductStatus) {
    /**
     * The product is available for selling.
     */
    ProductStatus[ProductStatus["NOT_ON_SALE"] = 0] = "NOT_ON_SALE";
    /**
     * The product is not available for selling.
     */
    ProductStatus[ProductStatus["ON_SALE"] = 1] = "ON_SALE";
    /**
     * The product is recalled by its manufacturer.
     */
    ProductStatus[ProductStatus["RECALLED"] = 2] = "RECALLED";
})(ProductStatus = exports.ProductStatus || (exports.ProductStatus = {}));
//# sourceMappingURL=constants-shared.js.map