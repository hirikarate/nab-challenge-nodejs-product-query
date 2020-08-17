"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = exports.compose = void 0;
/* eslint-enable max-len */
/**
 * Functional programming style for nested calls.
 * The call order is right-to-left or bottom-up.
 *
 * @example
 * Instead of `funcA(funcB(funcC(param)))`, use `compose(funcA, funcB, funcC)(param)`
 */
exports.compose = (...functions) => (initialValue) => functions.reduceRight((value, func) => (func ? func(value) : value), initialValue);
/**
 * Functional programming style for nested calls.
 * The call order is left-to-right or top-down.
 *
 * @example
 *  Instead of `funcA(funcB(funcC(param)))`, use `pipe(funcC, funcB, funcA)(param)`
 */
exports.pipe = (...functions) => (initialValue) => functions.reduce((value, func) => (func ? func(value) : value), initialValue);
//# sourceMappingURL=functional-utils.js.map