import AWS from './awsSDK';
import depKeys from '../../constants/dependencyKeys';
import dependencyContainer from '../../utils/dependencyContainer';
import {
	camelizeObjKeys,
} from '../../utils/helpers';


/**
 * Sends `data` to specified SQS `queueUrl`.
 *
 * @param {string} queueUrl SQS queue URL
 * @param {any} data Any JSON-serializable data type
 *
 * @returns {Promise}
 */
export async function sendSQSMessage(queueUrl, data) {
	const sqs = new AWS.SQS();
	const params = {
		MessageBody: JSON.stringify(data),
		QueueUrl: queueUrl
	};

	const result = await sqs.sendMessage(params).promise();

	// For result's field meaning, see interface `SendMessageResult` in node_modules\aws-sdk\clients\sqs.d.ts
	return camelizeObjKeys(result);
}
