import { constants } from '@micro-fleet/common'

const {
	Cache: C,
	Service: S,
	MessageBroker: M,
	RPC,
	Web: W,
} = constants


export = {
	[S.SERVICE_SLUG]: 'nab-product-rest-service',
	[C.CACHE_NUM_CONN]: 1,
	[C.CACHE_HOST]: 'localhost',
	[M.MSG_BROKER_HOST]: 'localhost',
	[M.MSG_BROKER_USERNAME]: 'guest',
	[M.MSG_BROKER_PASSWORD]: 'guest',
	[M.MSG_BROKER_EXCHANGE]: 'amq.topic',
	[M.MSG_BROKER_MSG_EXPIRE]: 30e3,
	[RPC.RPC_CALLER_TIMEOUT]: 30e3,
	[W.WEB_PORT]: 3000,
	[W.WEB_URL_PREFIX]: '/api/v1',
	[W.WEB_CORS]: '*',
}
