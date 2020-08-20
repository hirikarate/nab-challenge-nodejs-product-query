module.exports.sqs = () => {
	// Code that generates dynamic data
	var urlPrefix = "https://sqs.us-west-2.amazonaws.com/130994109741/";
	return {
		deleteColorNotesQueueUrl: urlPrefix + "delete-color-notes",
		createServiceQueueURL: urlPrefix + "create-service",
		createServiceWithoutEmployeeQueueURL: urlPrefix + "create-service-without-employee",
		createTenderQueueURL: urlPrefix + "create-tender",
		employeeClockOutQueueUrl: urlPrefix + "employee-clock-out",
		updateEmployeeProfileQueueUrl: urlPrefix + "update-employee-profile",
		deleteEmployeeQueueUrl: urlPrefix + "delete-employee",
		deleteTokenQueueUrl: urlPrefix + "delete-token",
		deleteQRCodeQueueUrl: urlPrefix + "delete-qr-code",
		createTokenQueueUrl: urlPrefix + "create-token",
		createCashSalaryPaymentQueueUrl: urlPrefix + "create-cash-salary-payments",
		weeklyScheduleQueueUrl: urlPrefix + "create-weekly-schedules",
		createCustomerDiscountCoverQueueUrl: urlPrefix + "create-customer-discount-cover",
		createTipTransactionFeeQueueUrl: urlPrefix + "create-tip-transaction-fee",
		createEmployeeQueueUrl: urlPrefix + "create-employees",
		createLocationQueueUrl: urlPrefix + "create-locations",
		sendEmployeeQueueUrl: urlPrefix + "send-employees",
		sendNotificationQueueUrl: urlPrefix + "send-notification",
		createCategoryQueueUrl: urlPrefix + "create-categories",
		createCustomerQueueUrl: urlPrefix + "create-customers",
		approveDeclineAppointmentQueueUrl: urlPrefix + "approve-or-decline-appointment",
		sendSMSQueueUrl: urlPrefix + "send-sms",
		customerSendSMSQueueUrl: urlPrefix + "customer-send-sms"
	};
};

module.exports.appConfig = () => {
	return {
		clientId: "sq0idp-QU5T5cnKFOGOnJK81-0plA",
		clientSecret: "sq0csp-nVhrlo7ankYmBhFzOdLdZKYUuUmevQg-pxis_HlEW7o",
		pipelineSlackNotificationPath: "/services/TH86H34PN/BQ87P6R5W/IQftM8kaOJMClqv8OG91vfGB",
		appConfigProxyPath: "https://d1unlbo8fa6dzt.cloudfront.net",
		domainExtension: ".net",
		fromEmail: "developer@salonmanager.net",
		platformApplicationArn: 'arn:aws:sns:us-west-2:130994109741:app/APNS_SANDBOX/SalonManagerSalonApp',
		widgetConfigS3Bucket: 'configs.widgets.salonmanager.net',
		widgetCloudFrontId: 'E2GC7UX6J3W5FW',
		belmontWebsiteS3bucket: 'belmontbeautysalon.net',
		belmontWebsiteCloudFrontId: 'E2ZG232Q2KELCQ',
		salonmanagerWebsiteS3Bucket: 'salonmanager.net',
		salonmanagerWebsiteCloudFrontId: 'E13H3UHIC5IYQR',
		snsTopicArnSquareWebHookEvents: 'arn:aws:sns:us-west-2:130994109741:SquareWebHookEvents',
		squareWebHookSignatureKey: 'lky809rZCLInTqiME__XzQ',
		squareWebHookSignatureKeySandbox: 'XIYI91vDt1bSiJBzEo9MpQ',
		pinpointProjectId: 'bdcb5c41fe214c1d86b5f1a0e82ebf81',
		pinpointFromPhone: '+12299999757',
		widgetAppointmentConfirmKeyword: 'c',
		widgetAppointmentDeclineKeyword: 'x',
		bitlyAccessKey: '3c5cfa51f435af16b7cd167591f24eaeae8cc771',
		squareCatalogSignature: '5Njg4ERsUAvrmW9TWQAFow',
		squareCatalogWebhookURL: 'https://salon.api.salonmanager.net/v1/webhooks'
	};
};
