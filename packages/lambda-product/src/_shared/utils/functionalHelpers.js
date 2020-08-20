/**
 * @description Functional programming style for nested calls.
 *
 * @example
 * Instead of `funcA(funcB(funcC(param)))`, use `compose(funcA, funcB, funcC)(param)`
 */
export const compose = (...functions) => (initialValue) =>
	functions.reduceRight((value, func) => {
		return func ? func(value) : value;
	}, initialValue);


/**
 * @description
 * - Functional programming style for nested calls with reserve style,
 *		read from left-to-right or top-down could be better readability.
 *
 * @example
 *	Instead of `funcA(funcB(funcC(param)))`, use `pipe(funcC, funcB, funcA)(param)`
 */
export const pipe = (...functions) => (initialValue) =>
	functions.reduce((value, func) => {
		return func ? func(value) : value;
	}, initialValue);


/**
 * Resolves given `promise` then executes `callback`.
 *
 * @param {Function} callback
 */
export const promiseThen = (callback) => (promise) => promise.then(callback);


/**
 * Resolves dependency and invokes it, the dependency must be a function.
 *
 * @param {DependencyContainer} dependencyContainer The container instance
 * @param {string|symbol} identifier Dependency key
 */
export const resolveInvoke = (dependencyContainer, identifier) => (...args) =>
	dependencyContainer.resolve(identifier).apply(null, args);


/**
 * Executes `callback` when `value` is given, finally returns the `value`.
 * @param {function} callback
 */
export const tap = (callback) => (value) => (callback(value), value);
