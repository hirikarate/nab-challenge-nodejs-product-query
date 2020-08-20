module.exports.sqs = () => {
	// Code that generates dynamic data
	var urlPrefix = "https://sqs.us-west-1.amazonaws.com/005441408453/";
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
		clientId: "sq0idp-NoPXeMRhRK8vdsgeTrJuVw",
		clientSecret: "sq0csp-Knwcv3RztHtfmwmZxPgbXttiKt_N9NUVpQfsJGGvLkM",
		pipelineSlackNotificationPath: "/services/TH86H34PN/BQADV6V4N/c8PRJL4J4t1Avj56DPZwC5B2",
		appConfigProxyPath: "https://d1unlbo8fa6dzt.cloudfront.net",
		domainExtension: ".com",
		fromEmail: "developer@salonmanager.com",
		platformApplicationArn: 'arn:aws:sns:us-west-2:130994109741:app/APNS_SANDBOX/Salon_Manager_Salon_App_Prod',
		widgetConfigS3Bucket: 'configs.widgets.salonmanager.com',
		widgetCloudFrontId: 'E2GC7UX6J3W5FW',
		belmontWebsiteS3bucket: 'belmontbeautysalon.com',
		belmontWebsiteCloudFrontId: 'E1LERAINZIOQ1J',
		salonmanagerWebsiteS3Bucket: 'salonmanager.com',
		salonmanagerWebsiteCloudFrontId: 'E186GBJPEORZ6A',
		snsTopicArnSquareWebHookEvents: 'arn:aws:sns:us-west-2:130994109741:SquareWebHookEvents',
		squareWebHookSignatureKey: 'lky809rZCLInTqiME__XzQ',
		pinpointProjectId: 'bdcb5c41fe214c1d86b5f1a0e82ebf81',
		pinpointFromPhone: '+12299999757',
		widgetAppointmentConfirmKeyword: 'c',
		widgetAppointmentDeclineKeyword: 'x',
		bitlyAccessKey: '3c5cfa51f435af16b7cd167591f24eaeae8cc771'
	};
};
