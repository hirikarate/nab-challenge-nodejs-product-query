import AWS from './awsSDK';


/**
 * Sends `data` to specified SQS `queueUrl`.
 *
 * @param {string} topicArn SNS topic arn
 * @param {any} data Any JSON-serializable data type
 *
 * @returns {Promise<string>} A Promise that resolves to `messageId` if success
 */
export async function publishSNSMessage(topicArn, data, attributes={}) {
	const sns = new AWS.SNS();
	const params = {
		Message: JSON.stringify(data),
		TopicArn: topicArn,
		MessageAttributes: attributes,
	};

	const messageId = await sns.publish(params).promise();
	return messageId;
}
