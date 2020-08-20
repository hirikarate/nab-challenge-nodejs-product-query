import awsKeys from '../_shared/constants/dependencyKeys/aws';
import productSearchKeys from '../_shared/constants/dependencyKeys/productSearchService';
import dependencyContainer from '../_shared/utils/dependencyContainer';
import {
	useLogger,
} from '../_shared/services/logService';
import { createSearchClient } from '../_shared/services/aws/elasticSearch';
import * as productSearchService from '../_shared/services/productSearchService';
import {
	buildLambdaHttpResponse,
	registerCommonDependencies,
	withBasicSetup,
} from '../_shared/utils/helpers';
import {
	resolveInvoke,
	pipe,
	promiseThen,
	tap,
} from '../_shared/utils/functionalHelpers';
import {
	joi,
	assertValidFactory,
	listRequestSchema,
	withValidationErrorHandler,
} from '../_shared/utils/validationHelpers';


registerCommonDependencies();
dependencyContainer.register(awsKeys.AWS_ES_CREATE_CLIENT, createSearchClient);
dependencyContainer.register(awsKeys.ES_HOST, process.env.ES_HOST);
dependencyContainer.register(productSearchKeys.GET_FILTER_PRODUCTS, productSearchService.getFilterProducts);


//#region handler's input and output schema

const assertValidBody = assertValidFactory(
	listRequestSchema.keys({
		name: joi.string(),
		maxPrice: joi.number(),
		minPrice: joi.number(),
		color: joi.string(),
		status: joi.string(),
		branchIds: joi.array().single()
			.items(joi.string().regex(/^\d+$/).required()),
		categoryIds: joi.array().single()
			.items(joi.string().regex(/^\d+$/).required()),
		viewer: joi.object(),
		sortBy: joi.string().valid('name', 'price', 'createdAt'),
	})
	.default({})
);

const buildResponseBody = (filterMaybe) => filterMaybe
	.map(value => ({ // Only execute when Maybe.isJust
		hasData: true,
		...value,
	}))
	.mapError(error => ({  // Only execute when Maybe.isError
		hasData: false,
		error,
	}));

//#endregion handler's input and output schema


/**
 * [Lambda handler]
 *
 * Returns deails of the transaction with specified ID.
 */
export const handler = pipe(
	withValidationErrorHandler,
	withBasicSetup('filterProducts'),
)(processRequest);


export async function processRequest(lambdaEvent, lambdaContext, logger) {
	logger.debug('Lambda is invoked', {
		__DATA: { lambdaEvent, lambdaContext },
	});

	const {
		branchIds,
		categoryIds,
	} = lambdaEvent.multiValueQueryStringParameters
	const requestBody = assertValidBody({
		...lambdaEvent.queryStringParameters,
		branchIds,
		categoryIds,
	});

	return pipe(
		filterProducts,
		promiseThen(buildResponseBody),
		promiseThen(responseBody => buildLambdaHttpResponse({
			data: responseBody,
		})),
	)(requestBody);
}

const filterProducts = pipe(
	resolveInvoke(dependencyContainer, productSearchKeys.GET_FILTER_PRODUCTS),
	promiseThen(tap(maybe => useLogger().debug('After getFilterProducts', {
		__DATA: maybe.tryGetValue(),
	}))),
);
