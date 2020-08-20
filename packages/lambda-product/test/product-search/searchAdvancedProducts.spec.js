import {
	expect,
} from 'chai';

import awsKeys from '~shared/constants/dependencyKeys/aws';
import dependencyContainer from '~shared/utils/dependencyContainer';
import * as testUtils from '~shared-test/test-helpers';


/**
 * This if NOT a unit test, but for running Lambda locally.
 * Change .skip() to .only() to run it.
 */
describe.skip('product-search:searchAdvancedProducts', () => {

	let target;

	before(() => {
		testUtils.clearRequireCache();
		target = require('~src/product-search/searchAdvancedProducts');
		testUtils.mockCommonDependencies();
		dependencyContainer.register(awsKeys.ES_HOST, 'https://search-icommerce-7htb7n5ittiwrpm5iwcdomp6l4.ap-southeast-1.es.amazonaws.com/');
	});

	after(() => {
		dependencyContainer.reset();
	});

	it('Should return correct response', async () => {
		const event = {
			queryStringParameters: {
				keywords: 'dark scooter',
			},
		};

		try {
			const response = await target.handler(event, {});
			console.log({ response })
			expect(response.statusCode).to.equal(200);
		} catch (err) {
			console.error(err);
		}
	});


}); // END describe 'product-search:searchAdvancedProducts'
