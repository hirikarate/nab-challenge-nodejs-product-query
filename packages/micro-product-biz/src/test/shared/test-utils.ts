/* eslint-disable import/no-extraneous-dependencies */
import * as randomstring from 'randomstring'
import * as moment from 'moment'


/**
 * A no-op function.
 */
export const noop = () => {}


/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is not lower than min (or the next integer greater than min
 * if min isn't an integer) and not greater than max (or the next integer
 * lower than max if max isn't an integer).
 */
export const randomInt = (min = 0, max = Number.MAX_SAFE_INTEGER) => {
	const minLimit = Math.ceil(min)
	const maxLimit = Math.floor(max)
	// Using Math.round() will give you a non-uniform distribution!
	return Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit
}

/**
 * Returns a random string that matches the given `options`.
 * @param {number | object} options The max string length or a settings object.
 */
export const randomString = randomstring.generate

/**
 * Generates random a pseudo big int and optionally converts it to string.
 */
export const randomBigInt = (convertToString = true) => {
	const randFLoat = Math.random() * Number.MAX_SAFE_INTEGER
	const randInt = randFLoat.toFixed(0)
	const bigint = BigInt(randInt)
	return convertToString ? bigint.toString() : bigint
}

/**
 * Returns an instance of Moment with random values.
 */
export const randomMoment = () => {
	const DAY_RANGE = 30
	const MONTH_RANGE = 30
	const TIME_RANGE = 60
	return moment()
		.add(randomInt(-DAY_RANGE, DAY_RANGE), 'days')
		.add(randomInt(-MONTH_RANGE, MONTH_RANGE), 'months')
		.add(randomInt(-TIME_RANGE, TIME_RANGE), 'hours')
		.add(randomInt(-TIME_RANGE, TIME_RANGE), 'minutes')
		.add(randomInt(-TIME_RANGE, TIME_RANGE), 'seconds')
}

/**
 * Overwrites dependecy registries in helpers.js::registerCommonDependencies().
 */
// export function mockCommonDependencies() {
// 	dependencyContainer.register(awsKeys.AWS_PARAM_STORE, createMockParameterStore());
// 	dependencyContainer.register(commonKeys.HANDLE_ERROR, console.error);
// 	dependencyContainer.register(commonKeys.WRITE_LOG, noop);
// 	dependencyContainer.register(commonKeys.GET_DB_CONFIG, sinon.fake.resolves({
// 		host: 'salonmanagerdb-dev.cbavjhhjevkb.us-west-2.rds.amazonaws.com',
// 		user: 'salondbadmin',
// 		password: 'xqHG12d9RbOBgDln',
// 		database: 'SalonManagerDB-dev',
// 		max: 20,
// 		idleTimeoutMillis: 30000,
// 		connectionTimeoutMillis: 2000,
// 		region: 'us-west-2',
// 		}));
// }


export function clearRequireCache() {
	require.cache = {}
}
