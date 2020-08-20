// We mapped alias path to joi/dist/browser.min.js for smaller bundle size.
// This bundle references "window" object but doesn't use, so we mock it.
global.window = {};
export const joi = require('joi'); // Don't use `import` or Babel will hoist this statement onto above global.window={}.

import { SortType } from '../constants';
import * as ex from './exceptionHelpers';
import {
	buildLambdaHttpResponse,
} from './helpers';


export const httpGlobalHeaderSchema = joi.object({
		clientToken: joi.string(),
		clienttoken: joi.string(),
		timeZone: joi.string(),
		timezone: joi.string(),
		'x-client-request': joi.number(),
	})
	.xor('clientToken', 'clienttoken').rename('clienttoken', 'clientToken')
	.xor('timeZone', 'timezone').rename('timezone', 'timeZone')
	.unknown(true)
	.required();

export const httpGlobalQuerySchema = joi.object({
		debug: joi.boolean(),
	})
	.allow(null);

export const commonPathParamSchema = joi.object({
		locationId: joi.string().required(),
	})
	.required();

export const listRangeEventSchema = joi.object({
		headers: httpGlobalHeaderSchema,
		pathParameters: commonPathParamSchema,
		queryStringParameters: httpGlobalQuerySchema.keys({
				fromDate: joi.number(),
				toDate: joi.number(),
			})
			.unknown(true)
			.required(),
	})
	.unknown(true);

export const listRequestSchema = joi.object({
	pageIndex: joi.number().min(1).max(Number.MAX_SAFE_INTEGER).default(1),
	pageSize: joi.number().min(3).max(100).default(10),
	sortType: joi.string().valid(SortType.ASC, SortType.DESC),
});

/**
 * Represents a serializable error object when a model does not pass validation.
 */
export class ValidationError {

	/**
	 * Constructs an instance from Joi's error.
	 *
	 * @param {object} joiError The error object returned by joi.validate() function.
	 */
	static fromJoi(joiError) {
		const details = joiError.details.map(d => ({
			message: d.message,
			path: d.path || [],
			value: (d.context ? d.context.value : d.value),
		}));
		return new ValidationError(details);
	}


	/**
	 * @param {string|object|object[]} messageOrDetails The error message or an error details object or an array of error objects.
	 *
	 * @example
	 * new ValidationError("User's birthdate is invalid");
	 *
	 * @example
	 * new ValidationError({
	 *	 message: "User's birthdate is invalid",
	 *	 path: ['data', 'user', 'birthdate'],
	 *	 value: '31-2-4321',
	 * });
	 *
	 * @example
	 * new ValidationError([
	 *	{
	 *		message: "User's birthdate is invalid",
	 *		path: ['data', 'user', 'birthdate'],
	 *		value: '31-2-4321',
	 *	},
	 *	{
	 *		message: "Data range is invalid",
	 *		path: ['data', 'range', 'toDate'],
	 *		value: '31-2-2999',
	 *	},
	 * ]);
	 */
	constructor(messageOrDetails) {
		this.name = 'ValidationError';
		if (typeof messageOrDetails === 'string') {
			this.details = [{
				message: messageOrDetails,
			}];
		} else if (Array.isArray(messageOrDetails)) {
			this.details = messageOrDetails;
		} else {
			this.details = [messageOrDetails];
		}
	}
}

/**
 * Handles validation errors thrown by `targetFn` and builds a responses with status 500.
 * @param {function} targetFn The function to look after.
 */
export const withValidationErrorHandler = (targetFn) =>
	async (...args) => {
		try {
			// "await" can handle both async and sync returned results.
			return await targetFn(...args);
		} catch (error) {
			if (error instanceof ValidationError) {
				return buildLambdaHttpResponse({
					data: {
						hasData: false,
						error: error.details,
					},
					statusCode: 422, // https://httpstatuses.com/422 (UNPROCESSABLE ENTITY)
				});
			}

			// Forwards this error to upper scope
			throw error;
		}
	};


/**
 * Validates `data` using given `joiSchema`.
 */
export const validateSchema = (joiSchema, data) => {
	const result = {
		value: null,
		error: null,
	};
	const {
		value,
		error
	} = joiSchema.validate(data, {
		abortEarly: false
	});

	if (error) {
		result.error = ValidationError.fromJoi(error);
	} else {
		result.value = value;
	}
	return result;
};

/**
 * Creates a reusable validator that uses `joiSchema` and throws error when `data` is invalid.
 * @returns Sanitized data if valid
 * @throws ValidationError if invalid
 * @example
 * const assertValid = assertValidFactory(joi.string().min(50).max(100));
 * const sanitizedValue = assertValid("too short"); // Or throws ValidationError
 */
export const assertValidFactory = (joiSchema) => (data) => {
	const {
		value,
		error
	} = validateSchema(joiSchema, data);
	if (error) {
		throw error;
	}
	return value;
};


/**
 * Makes sure the specified `target` is not null or undefined.
 * @param {any} target Argument to check.
 * @param {string?} message Optional error message.
 * @param {any?} errorDetails If assertion fails, this will be the exception's details.
 * @param {boolean?} isCritical If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
 * @param {class} ExceptionClass The exception class to be thrown out when assertion fails. Default is AssertionException.
 * @throws {AssertionException} If assertion fails.
 */
export const assertIsDefined = (target, message, errorDetails, isCritical = false, ExceptionClass = ex.AssertionException) =>
	assertIsFalsey(target === null || target === undefined, message, errorDetails, isCritical, ExceptionClass);

/**
 * Makes sure the specified `target` is an object, array, or string which is not null or undefined.
 * If `target` is a string or array, it must have `length` greater than 0,
 * If it is an object, it must have at least one property.
 * @param {any} target Argument to check.
 * @param {string?} message Optional error message.
 * @param {any?} errorDetails If assertion fails, this will be the exception's details.
 * @param {boolean?} isCritical If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
 * @throws {AssertionException} If assertion fails.
 */
export const assertIsNotEmpty = (target, message, errorDetails, isCritical = false) =>
	assertIsFalsey(isEmpty(target), message, errorDetails, isCritical);

/**
 * Makes sure the specified `target` is a function.
 * @param {any} target Argument to check.
 * @param {string?} message Optional error message.
 * @param {any?} errorDetails If assertion fails, this will be the exception's details.
 * @param {boolean?} isCritical If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
 * @throws {AssertionException} If assertion fails.
 */
export const assertIsFunction = (target, message, errorDetails, isCritical = false) =>
	assertIsTruthy(typeof target === 'function', message, errorDetails, isCritical);

/**
 * Makes sure the specified `target` matches Regular Expression `rule`.
 * @param {RegExp} regExp Regular expression
 * @param {any} target Argument to check.
 * @param {string?} message Optional error message.
 * @param {any?} errorDetails If assertion fails, this will be the exception's details.
 * @param {boolean?} isCritical If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
 * @throws {AssertionException} If assertion fails.
 */
export const assertIsMatch = (regExp, target, message, errorDetails, isCritical = false) =>
	assertIsTruthy(regExp.test(target), message, errorDetails, isCritical);

/**
 * Makes sure the specified `target` is considered "truthy" based on JavaScript rule.
 * @param {any} target Argument to check.
 * @param {string?} message Error message.
 * @param {any?} errorDetails If assertion fails, this will be the exception's details.
 * @param {boolean?} isCritical If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
 * @param {class} ExceptionClass The exception class to be thrown out when assertion fails. Default is AssertionException.
 * @throws {AssertionException} If assertion fails.
 */
export const assertIsTruthy = (target, message, errorDetails, isCritical = false, ExceptionClass = ex.AssertionException) => {
	if (!target) {
		throw new ExceptionClass(message, errorDetails, isCritical);
	}
};

/**
 * Makes sure the specified `target` is considered "falsey" based on JavaScript rule.
 * @param {any} target Argument to check.
 * @param {string?} message Error message.
 * @param {any?} errorDetails If assertion fails, this will be the exception's details.
 * @param {boolean?} isCritical If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
 * @param {class} ExceptionClass The exception class to be thrown out when assertion fails. Default is AssertionException.
 * @throws {AssertionException} If assertion fails.
 */
export const assertIsFalsey = (target, message, errorDetails, isCritical = false, ExceptionClass = ex.AssertionException) => {
	if (target) {
		throw new ExceptionClass(message, errorDetails, isCritical);
	}
};

/**
 * Makes sure the specified `target` is not null or undefined.
 * @param {string} name Name to include in error message if assertion fails.
 * @param {any} target Argument to check.
 * @param {string?} message Optional error message.
 * @throws {InvalidArgumentException} If assertion fails.
 */
export const assertArgDefined = (name, target, message) => {
	if (target === null || target === undefined) {
		throw new ex.InvalidArgumentException(name, message || 'Must not be null or undefined!');
	}
};

/**
 * Makes sure the specified `target` is an object, array, or string which is not null or undefined.
 * If `target` is a string or array, it must have `length` greater than 0,
 * If it is an object, it must have at least one property.
 * @param {string} name Name to include in error message if assertion fails.
 * @param {any} target Argument to check.
 * @param {string?} message Optional error message.
 * @throws {InvalidArgumentException} If assertion fails.
 */
export const assertArgNotEmpty = (name, target, message) => {
	if (isEmpty(target)) {
		throw new ex.InvalidArgumentException(name, message || 'Must not be null, undefined or empty!');
	}
};

/**
 * Checks if the input is null, or empty string/array or object with no property.
 */
export const isEmpty = (target) => ((target == null) || target.length === 0 || (typeof target !== 'symbol' && Object.keys(target).length == 0));
