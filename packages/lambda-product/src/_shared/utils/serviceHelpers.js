import { useLogger } from '../services/logService';
import { query } from './helpers';
import { Maybe } from './models/Maybe';
import { assertIsTruthy } from './validationHelpers';


export const buildServiceSingleResult = async (queryResultPromise) => {
	const { rows } = await queryResultPromise;
	return (rows && rows[0]) ? Maybe.Just(rows[0]) : Maybe.Nothing();
};

export const buildServiceListResult = async (queryResultPromise) =>
	Maybe.Just(await queryResultPromise);

export const buildServiceLegacyResult = async (queryResultPromise, isSuccess = true) => ({
	success: isSuccess,
	data: await queryResultPromise,
});

export const buildQueryParamGetRange = (params) =>
	[params.locationId, params.fromDate, params.toDate];

/**
 * Executes a SQL Function to fetch data with query `select * from sqlFunctionName()`.
 *
 * @param {string} sqlFunctionName
 * @param {number?} paramHolderCount
 *	 If given, it is the quantity of query parameter holders, so that
 *	 the query will look like `select * from sqlFunctionName($1, $2, $3)`,
 *	 then `paramStringOrValues` must be an array of values.
 *
 *	 If not specified, `paramStringOrValues` must be a string of raw param values,
 *	 so that the query will look like `select * from sqlFunctionName('My Name', 30, true)`
 */
export const executeSqlQueryFunction = (sqlFunctionName, paramHolderCount=null) =>
	(paramStringOrValues) => {
		if (!paramHolderCount) {
			return query(`select * from ${sqlFunctionName}(${paramStringOrValues});`);
		}
		assertIsTruthy(Array.isArray(paramStringOrValues), '"paramStringOrValues" must be an array');
		const holders = [...Array(paramHolderCount)].map((_, i) => `$${i+1}`).join(',');
		return query(`select * from ${sqlFunctionName}(${holders});`, paramStringOrValues);
	};


/**
 * Executes a SQL Function to mutate data with query `select sqlFunctionName()`.
 *
 * @param {string} sqlFunctionName
 * @param {number?} paramHolderCount
 *	 If given, it is the quantity of query parameter holders, so that
 *	 the query will look like `select from sqlFunctionName($1, $2, $3)`,
 *	 then `paramStringOrValues` must be an array of values.
 *
 *	 If not specified, `paramStringOrValues` must be a string of raw param values,
 *	 so that the query will look like `select from sqlFunctionName('My Name', 30, true)`
 */
export const executeSqlMutateFunction = (sqlFunctionName, paramHolderCount=null) =>
	(paramStringOrValues) => {
		if (!paramHolderCount) {
			return query(`select ${sqlFunctionName}(${paramStringOrValues});`);
		}
		assertIsTruthy(Array.isArray(paramStringOrValues), '"paramStringOrValues" must be an array');
		const holders = [...Array(paramHolderCount)].map((_, i) => `$${i+1}`).join(',');
		return query(`select ${sqlFunctionName}(${holders});`, paramStringOrValues);
	};

export const wrapDbQuote = (source) => `'${source}'`;

/**
* Handles all errors thrown by `targetFn` and builds a responses with status 500.
* @param {string} functionName Name of `targetFn` to appear in logs.
*/
export const withServiceErrorHandler = (functionName) =>
	/**
	* @param targetFn {function} The function to look after.
	*/
	(targetFn) =>
		async (...args) => {
			try {
				return await targetFn(...args);
			} catch (error) {
				await useLogger(functionName).errorAsync(error, {
					__DATA: [...args],
				});
				return Maybe.Error(error, functionName);
			}
		};
