
import awsKeys from '../constants/dependencyKeys/aws';
import commonKeys from '../constants/dependencyKeys/common';
import dependencyContainer from './dependencyContainer';
import {
	createParameterStore,
} from '../services/aws/systemManagerService';
import { useLogger } from '../services/logService';


/**
 * Builds a standard HTTP response object for Lambda function handlers.
 *
 * @param {object?} params An optional object with format: {
 *	 data: <optional> <object> <default: null>,
 *	 headers: <optional> <object> <default: {}>,
 *	 statusCode: <optional> <number> <default: 200>,
 * }
 *
 * @example
 * responseBuilder()
 *
 * @example
 * responseBuilder({
 *	 data: { key: 'value' },
 * })
 *
 * @example
 * responseBuilder({
 *	 statusCode: 500,
 * })
 */
export const buildLambdaHttpResponse = ({ headers = {}, statusCode = 200, data }) =>
	({
		statusCode,
		headers,
		body: JSON.stringify(data),
	});


/**
 * Registers some popular dependencies, such as logging function.
 * This function should be called ONCE at the beginning of Lambda functions.
 */
export function registerCommonDependencies() {
	dependencyContainer.register(awsKeys.AWS_PARAM_STORE, createParameterStore());
}


/**
 * Handles all errors thrown by `targetFn` and builds a responses with status 500.
 * @param {string} lambdaName Name of Lambda Function (usually is `targetFn`'s name) to appear in logs.
 * @param {boolean} noResponseOnError If true, do not response anything.
 *	 This is for operations not triggered by HTTP requests. Default is false.
 */
export const withBasicSetup = (lambdaName, noResponseOnError = false) =>
	/**
	 * @param targetFn {function} The function to look after.
	 */
	(targetFn) =>
		async (lambdaEvent, lambdaContext) => {
			try {
				// Register global lambda variables
				dependencyContainer.register(commonKeys.LAMBDA_EVENT, lambdaEvent);
				dependencyContainer.register(commonKeys.LAMBDA_CONTEXT, lambdaContext);

				// Prefetch SSM parameters so that other services (like logging)
				// don't have to fetch them in EVERY function call.
				const paramStore = dependencyContainer.resolve(awsKeys.AWS_PARAM_STORE);
				await paramStore.init();

				// Register another logger with this context name.
				const logger = useLogger(lambdaName);
				dependencyContainer.register(commonKeys.LOGGING_SERVICE, logger);

				// "await" can handle both async and sync returned results.
				return await targetFn(lambdaEvent, lambdaContext, logger);
			}
			catch (error) {
				const logger = dependencyContainer.tryResolve(commonKeys.LOGGING_SERVICE, null);
				const errorContext = 'withBasicSetup tryCatch - ' + lambdaName;

				if (logger) {
					// Waits for Sentry to flush
					await logger.errorAsync(error, {
						__FUNCTION: errorContext,
					});
				} else { // If error occurs too soon
					console.error(errorContext, error);
				}

				if (!noResponseOnError) {
					return buildLambdaHttpResponse({
						statusCode: 500,
					});
				}
			}
		};
