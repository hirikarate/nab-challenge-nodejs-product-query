Error.stackTraceLimit = 20;

export class Exception extends Error {

	/**
	 *
	 * @param {string} message Error message.
	 * @param {object?} details An object explaining what this exception is about.
	 * @param {bool?} isCritical Whether the whole application is stopped by this exception.
	 * @param {class?} exceptionClass The exception class to exclude from stacktrace.
	 */
	constructor(message, details, isCritical = true, exceptionClass = null) {
		super(message);
		this.name = 'Exception';
		this.message = message;
		this.details = details;
		this.isCritical = isCritical;
		Error.captureStackTrace(this, exceptionClass || Exception);
	}

	toString() {
		// Eg 1: [Critical] A big mess has happened!
		//				 <stacktrace here>
		//
		// Eg 2: [Minor]
		//				 <stacktrace here>
		return `[${ (this.isCritical ? 'Critical' : 'Minor') }] ${ this.message ? this.message : '' }`
			+ `\n ${JSON.stringify(this.details)} \n ${this.stack}`;
	}
}


/**
 * Represents a serious problem that may cause the system in unstable state
 * and need restarting.
 */
export class CriticalException extends Exception {

	/**
	 * @param {string} message Error message.
	 * @param {object?} details An object explaining what this exception is about.
	 */
	constructor(message, details) {
		super(message, details, true, CriticalException);
		this.name = 'CriticalException';
	}
}


/**
 * Represents an acceptable problem that can be handled
 * and the system does not need restarting.
 */
export class MinorException extends Exception {

	/**
	 * @param {string} message Error message.
	 * @param {object?} details An object explaining what this exception is about.
	 */
	constructor(message, details) {
		super(message, details, false, MinorException);
		this.name = 'MinorException';
	}
}


/**
 * Represents an error thrown when an assertion fails.
 */
export class AssertionException extends Exception {

	/**
	 * @param {string?} message Error message
	 * @param {object?} details An object explaining what this exception is about.
	 * @param {bool?} isCritical Whether the whole application is stopped by this exception.
	 */
	constructor(message, details, isCritical) {
		super(message, details, isCritical, AssertionException);
		this.name = 'AssertionException';
	}
}

/**
 * Represents an error where the provided argument of a function or class constructor
 * is not as expected.
 */
export class InvalidArgumentException extends Exception {

	/**
	 * @param {string} argName Argument name
	 * @param {string?} message Error message
	 */
	constructor(argName, message) {
		super(`The argument "${argName}" is invalid! ${(message ? message : '')}`, null, false, InvalidArgumentException);
		this.name = 'InvalidArgumentException';
	}
}
