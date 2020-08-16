"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Indices_1 = require("../constants/Indices");
exports.default = [
    {
        index: Indices_1.default.PRODUCT_FILTER,
        body: {
            properties: {
                name: { type: 'text' },
                price: { type: 'double' },
                color: { type: 'keyword' },
                status: { type: 'keyword' },
                branchIds: { type: 'long' },
                branches: { type: 'object' },
                categoryId: { type: 'long' },
                category: { type: 'object' },
            },
        },
    },
    {
        index: Indices_1.default.PRODUCT_SEARCH,
        body: {
            properties: {
                name: { type: 'text' },
                price: { type: 'double' },
                color: { type: 'text' },
                status: { type: 'keyword' },
                branchIds: { type: 'long' },
                branches: { type: 'object' },
                categoryId: { type: 'long' },
                category: { type: 'object' },
            },
        },
    },
];
//# sourceMappingURL=mapping-product.js.map