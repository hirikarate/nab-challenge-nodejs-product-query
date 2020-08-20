import * as sinon from 'sinon';
import * as randomstring from 'randomstring';
import * as uuid from 'uuid';
import moment from 'moment';

import commonKeys from '~src/_shared/constants/dependencyKeys/common';
import awsKeys from '~src/_shared/constants/dependencyKeys/aws';
import dependencyContainer from '~src/_shared/utils/dependencyContainer';
import {
	Maybe,
} from '~src/_shared/utils/models/Maybe';
import createMockParameterStore from './services/systemManagerService.mock';


/**
 * A no-op function.
 */
export const noop = () => {};


/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is not lower than min (or the next integer greater than min
 * if min isn't an integer) and not greater than max (or the next integer
 * lower than max if max isn't an integer).
 *
 * @see https://stackoverflow.com/a/1527820/866613
 */
export const randomInt = (min = 0, max = Number.MAX_SAFE_INTEGER) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	// Using Math.round() will give you a non-uniform distribution!
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns a random string that matches the given `options`.
 * @param options {number | object} The max string length or a settings object.
 */
export const randomString = randomstring.generate;

/**
 * Returns a UUID v4.
 */
export const randomUuid = uuid.v4;

/**
 * Returns an instance of Moment with random values.
 */
export const randomMoment = () => {
	const DAY_RANGE = 30;
	const MONTH_RANGE = 30;
	const TIME_RANGE = 60;
	return moment()
		.add(randomInt(-DAY_RANGE, DAY_RANGE), 'days')
		.add(randomInt(-MONTH_RANGE, MONTH_RANGE), 'months')
		.add(randomInt(-TIME_RANGE, TIME_RANGE), 'hours')
		.add(randomInt(-TIME_RANGE, TIME_RANGE), 'minutes')
		.add(randomInt(-TIME_RANGE, TIME_RANGE), 'seconds');
};

/**
 * Overwrites dependecy registries in helpers.js::registerCommonDependencies().
 */
export function mockCommonDependencies() {
	dependencyContainer.register(awsKeys.AWS_PARAM_STORE, createMockParameterStore());
	dependencyContainer.register(commonKeys.HANDLE_ERROR, console.error);
	dependencyContainer.register(commonKeys.WRITE_LOG, noop);
	dependencyContainer.register(commonKeys.GET_DB_CONFIG, sinon.fake.resolves({
			host: 'salonmanagerdb-dev.cbavjhhjevkb.us-west-2.rds.amazonaws.com',
			user: 'salondbadmin',
			password: 'xqHG12d9RbOBgDln',
			database: 'SalonManagerDB-dev',
			max: 20,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
			region: 'us-west-2',
		}));
}


/**
 * Creates a function which can creates a fake async implementation of service functions for unit-testing.
 *
 * @param depKey {string | symbol} The key to register to dependency container.
 * @param createResponse {function} Function to create fake response.
 */
export function mockLegacyServiceFactory(depKey, createResponse) {
	return (isSuccess = true, response = undefined) => {
		let fakeImpl;
		if (!isSuccess) {
			fakeImpl = sinon.fake.resolves({ success: false });
		}
		else {
			const fakeResponse = response || createResponse();
			fakeImpl = sinon.fake.resolves(fakeResponse);
		}
		dependencyContainer.register(depKey, fakeImpl);
		return fakeImpl;
	};
}


/**
 * Creates a function which can creates a fake async implementation of service functions for unit-testing.
 *
 * @param depKey {string | symbol} The key to register to dependency container.
 * @param createResponse {function} Function to create fake response.
 */
export function mockServiceFactory(depKey, createResponse) {
	return (hasValue = true, response, error) => {
		let fakeImpl;
		if (error) {
			fakeImpl = sinon.fake.resolves(Maybe.Error(error));
		} else if (!hasValue) {
			fakeImpl = sinon.fake.resolves(Maybe.Nothing());
		} else {
			const fakeResponse = response || createResponse();
			fakeImpl = sinon.fake.resolves(Maybe.Just(fakeResponse));
		}
		dependencyContainer.register(depKey, fakeImpl);
		return fakeImpl;
	};
}

export function clearRequireCache() {
	require.cache = {};
}
