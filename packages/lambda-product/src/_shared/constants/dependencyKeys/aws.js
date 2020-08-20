export default Object.freeze({

	//#region AWS Service instances

	AWS_PARAM_STORE: 'awsService:SSMParameterStore',
	AWS_SQS_SEND_MESSAGE: 'awsService:sendSQSMessage',
	AWS_SNS_PUBLISH_MESSAGE: 'awsService:publishSNSMessage',
	AWS_ES_CREATE_CLIENT: 'awsService:createElasticSearchClient',

	//#endregion AWS Service instances

	ES_HOST: 'aws:EsHost',
});
