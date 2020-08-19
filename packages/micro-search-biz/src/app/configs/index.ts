import { constants } from '@micro-fleet/common'

import { AWS, ElasticSearch as ES } from '../constants/SettingKeys'
import productMappings from './mapping-product'

const {
	MessageBroker: M,
	Service: S,
	RPC,
} = constants


export = {
	[S.SERVICE_SLUG]: 'nab-product-search-biz-service',
	[AWS.REGION]: 'ap-southeast-1',
	[AWS.ACCESS_KEY]: 'ACCESS_KEY',
	[AWS.SECRET_KEY]: 'SECRET_KEY',
	[ES.HOST]: 'https://ap-southeast-1.es.amazonaws.com/',
	[ES.MAPPINGS]: [
		...productMappings,
		// ...Other mappings here
	],
	[M.MSG_BROKER_HOST]: 'localhost',
	[M.MSG_BROKER_USERNAME]: 'guest',
	[M.MSG_BROKER_PASSWORD]: 'guest',
	[M.MSG_BROKER_EXCHANGE]: 'amq.topic',
	[M.MSG_BROKER_HANDLER_QUEUE]: 'nab-product-search-biz-handler',
	[M.MSG_BROKER_MSG_EXPIRE]: 30e3,
	[RPC.RPC_CALLER_TIMEOUT]: 30e3,
}
