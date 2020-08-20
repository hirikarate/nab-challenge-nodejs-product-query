import {
	Exception
} from '../exceptionHelpers';


/**
 * Represents an object which may or may not have a value.
 * Use this class to avoid assigning `null` to a variable.
 * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/src/Maybe.js
 * and V8 Maybe: https://v8docs.nodesource.com/node-9.3/d9/d4b/classv8_1_1_maybe.html
 */
export /* abstract */ class Maybe {

	/**
	 * Creates an erroneous Maybe which throws `ErroneousMaybeException` if attempting to get value.
	 * @param {object} error The error object.
	 * @param {string?} name The debugging-friendly name to included in error message or `toString()` result.
	 */
	static Error(error, name = 'Error') {
		return new ErrorInside(error, name);
	}

	/**
	 * Creates an empty Maybe which throws `EmptyMaybeException` if attempting to get value.
	 * @param {string?} name The debugging-friendly name to included in error message or `toString()` result.
	 */
	static Nothing(name = 'Nothing') {
		return new Nothing(name);
	}

	/**
	 * Creates a Maybe wrapping a value.
	 * @param {any} value The value to be wrapped, it may be anything even `null` or `undefined`.
	 * @param {string?} name The debugging-friendly name to included in error message or `toString()` result.
	 */
	static Just(value, name = 'Just') {
		return new Just(value, name);
	}

	static isJust(target) {
		return (target instanceof Just);
	}

	static isNothing(target) {
		return (target instanceof Nothing);
	}

	static isError(target) {
		return (target instanceof ErrorInside);
	}

	static isMaybe(target) {
		return this.isJust(target) || this.isNothing(target) || this.isError(target);
	}

	/* private */
	constructor($name) {
		this.$name = $name;
	}
}


class Just extends Maybe {

	get isJust() {
		return true;
	}

	get isNothing() {
		return false;
	}

	get isError() {
		return false;
	}

	get value() {
		return this._value;
	}

	get error() {
		return null;
	}

	constructor(value, name) {
		super(name);
		this._value = value;
		Object.freeze(this);
	}

	/**
	 * When this Maybe is wrapping a function, `ap` invokes this function
	 * with input from `anotherMaybe`'s wrapped value.
	 * @param {Maybe} anotherMaybe
	 */
	ap(anotherMaybe) {
		return anotherMaybe.map(this._value);
	}

	/**
	 * Invokes `fn` if this is MayBe.Just
	 *
	 * @param {(val) => Maybe} fn A function that receives the wrapped value,
	 * and returns another Maybe.
	 */
	chain(fn) {
		return fn(this._value);
	}

	/**
	 * Invokes `fn` if this is MayBe.Just
	 *
	 * @param {(val) => any} fn A function that receives the wrapped value,
	 * and returns another value to wrap.
	 */
	map(fn) {
		return new Just(fn(this._value));
	}

	chainNothing() {
		return this;
	}

	mapNothing() {
		return this;
	}

	mapError() {
		return this;
	}

	chainError() {
		return this;
	}

	tryGetValue(defaultVal) {
		return this._value;
	}

	toString() {
		return `Maybe.Just(${this._value}, ${this.$name})`;
	}
}


class Nothing extends Maybe {

	get isJust() {
		return false;
	}

	get isNothing() {
		return true;
	}

	get isError() {
		return false;
	}

	get error() {
		throw new EmptyMaybeException(this.$name);
	}

	get value() {
		throw new EmptyMaybeException(this.$name);
	}


	constructor(name) {
		super(name);
		Object.freeze(this);
	}

	/**
	 * Invokes `fn` if this is MayBe.Nothing
	 *
	 * @param {(val) => void} fn A function that returns another Maybe.
	 */
	chainNothing(fn) {
		return fn();
	}

	/**
	 * Invokes `fn` if this is MayBe.Nothing
	 */
	mapNothing(fn) {
		fn();
		return this;
	}

	ap() {
		return this;
	}

	chain() {
		return this;
	}

	map() {
		return this;
	}

	mapError() {
		return this;
	}

	chainError() {
		return this;
	}

	tryGetValue(defaultVal) {
		return defaultVal;
	}

	toString() {
		return `Maybe.Nothing(${this.$name})`;
	}
}


// "Error" is a system class name, so we named it "ErrorInside"
class ErrorInside extends Maybe {

	get isJust() {
		return false;
	}

	get isNothing() {
		return false;
	}

	get isError() {
		return true;
	}

	get error() {
		return this._error;
	}

	get value() {
		throw new ErroneousMaybeException(this.$name);
	}


	constructor(error, name) {
		super(name);
		this._error = error;
		Object.freeze(this);
	}

	/**
	 * Invokes `fn` if this is MayBe.Error
	 *
	 * @param {(error) => any} fn
	 */
	mapError(fn) {
		return new Just(fn(this._error));
	}

	/**
	 * Invokes `fn` if this is MayBe.Error
	 *
	 * @param {(error) => void} fn A function that returns another Maybe.
	 */
	chainError(fn) {
		return fn(this._error);
	}

	ap() {
		return this;
	}

	chain() {
		return this;
	}

	map() {
		return this;
	}

	chainNothing() {
		return this;
	}

	mapNothing() {
		return this;
	}

	tryGetValue(defaultVal) {
		return defaultVal;
	}

	toString() {
		return `Maybe.Error(${this.$name})`;
	}
}


/**
 * Represents an error when attempting to get value from a Maybe.Nothing
 */
export class EmptyMaybeException extends Exception {
	constructor(maybeName) {
		super(`This Maybe ${maybeName} has Nothing`, null, false, EmptyMaybeException);
		this.name = 'EmptyMaybeException';
	}
}

/**
 * Represents an error when attempting to get value from a Maybe.Error
 */
export class ErroneousMaybeException extends Exception {
	constructor(maybeName) {
		super(`This Maybe ${maybeName} has Error`, null, false, ErroneousMaybeException);
		this.name = 'ErroneousMaybeException';
	}
}
