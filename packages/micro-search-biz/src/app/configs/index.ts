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
	[AWS.ACCESS_KEY]: 'AKIAWCNSVEYMSWGV3NM6',
	[AWS.SECRET_KEY]: '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',
	[ES.HOST]: 'https://search-icommerce-7htb7n5ittiwrpm5iwcdomp6l4.ap-southeast-1.es.amazonaws.com/',
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
