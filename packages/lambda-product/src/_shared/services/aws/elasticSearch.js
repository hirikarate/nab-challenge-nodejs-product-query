import { Client } from '@elastic/elasticsearch'
import createAwsConnector from 'aws-elasticsearch-connector'

import AWS from './awsSDK';


/**
 * Initializes an ElastcSearch client instance
 */
export const createSearchClient = (url) => new Client({
	...createAwsConnector(AWS.config),
	node: url,
});
