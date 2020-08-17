/* eslint-disable max-len */
export interface IComposeFn {
	<TArg extends any[], T1>(fn1: (...args: TArg) => T1): (...args: TArg) => T1
	<TArg extends any[], T1, T2>(fn2: (x: T1) => T2, fn1: (...args: TArg) => T1): (...args: TArg) => T2
	<TArg extends any[], T1, T2, T3>(fn3: (x: T2) => T3, fn2: (x: T1) => T2, fn0: (...args: TArg) => T1): (...args: TArg) => T3
	<TArg extends any[], T1, T2, T3, T4>(fn4: (x: T3) => T4, fn3: (x: T2) => T3, fn2: (x: T1) => T2, fn0: (...args: TArg) => T1): (...args: TArg) => T4
	<TArg extends any[], T1, T2, T3, T4, T5>(fn5: (x: T4) => T5, fn4: (x: T3) => T4, fn3: (x: T2) => T3, fn2: (x: T1) => T2, fn0: (...args: TArg) => T1): (...args: TArg) => T5
	<TArg extends any[], T1, T2, T3, T4, T5, T6>(fn6: (x: T5) => T6, fn5: (x: T4) => T5, fn4: (x: T3) => T4, fn3: (x: T2) => T3, fn2: (x: T1) => T2, fn0: (...args: TArg) => T1): (...args: TArg) => T6
}

export interface IPipeFn {
	<TArg extends any[], T1>(fn1: (...args: TArg) => T1): (...args: TArg) => T1
	<TArg extends any[], T1, T2>(fn1: (...args: TArg) => T1, fn2: (x: T1) => T2): (...args: TArg) => T2
	<TArg extends any[], T1, T2, T3>(fn1: (...args: TArg) => T1, fn2: (x: T1) => T2, fn3: (x: T2) => T3): (...args: TArg) => T3
	<TArg extends any[], T1, T2, T3, T4>(fn1: (...args: TArg) => T1, fn2: (x: T1) => T2, fn3: (x: T2) => T3, fn4: (x: T3) => T4): (...args: TArg) => T4
	<TArg extends any[], T1, T2, T3, T4, T5>(fn1: (...args: TArg) => T1, fn2: (x: T1) => T2, fn3: (x: T2) => T3, fn4: (x: T3) => T4, fn5: (x: T4) => T5): (...args: TArg) => T5
	<TArg extends any[], T1, T2, T3, T4, T5, T6>(fn1: (...args: TArg) => T1, fn2: (x: T1) => T2, fn3: (x: T2) => T3, fn4: (x: T3) => T4, fn5: (x: T4) => T5, fn6: (x: T5) => T6): (...args: TArg) => T6
}
/* eslint-enable max-len */


/**
 * Functional programming style for nested calls.
 * The call order is right-to-left or bottom-up.
 *
 * @example
 * Instead of `funcA(funcB(funcC(param)))`, use `compose(funcA, funcB, funcC)(param)`
 */
export const compose: IComposeFn = (...functions: any[]) => (initialValue: any) =>
	functions.reduceRight(
		(value: any, func: Function) => (func ? func(value) : value),
		initialValue,
	)


/**
 * Functional programming style for nested calls.
 * The call order is left-to-right or top-down.
 *
 * @example
 *  Instead of `funcA(funcB(funcC(param)))`, use `pipe(funcC, funcB, funcA)(param)`
 */
export const pipe: IPipeFn = (...functions: any[]) => (initialValue: any) =>
	functions.reduce(
		(value: any, func: Function) => (func ? func(value) : value),
		initialValue,
	)
