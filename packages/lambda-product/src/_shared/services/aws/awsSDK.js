import aws from 'aws-sdk';
import xray from 'aws-xray-sdk';


aws.config.update({
	region: process.env.AWS_REGION,
});

let stage = process.env.SLS_ENV || process.env.stage;
const awsWrapped = (stage === 'dev') ? aws : xray.captureAWS(aws);

export default awsWrapped;
