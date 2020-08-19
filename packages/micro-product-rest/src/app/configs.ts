import * as path from 'path'

import { constants } from '@micro-fleet/common'

import { Auth as A } from './constants/AuthSettingKeys'
import { RPCCaller } from './constants/RPCCallerSettingKeys'


const {
	Cache: C,
	Service: S,
	MessageBroker: M,
	RPC,
	Web: W,
} = constants
const cwd = process.cwd()

export = {
	[S.SERVICE_SLUG]: 'nab-product-rest-service',
	[A.AUTH_EXPIRE_ACCESS]: '30m', // 30 minutes
	[A.AUTH_EXPIRE_REFRESH]: '30d', // 30 days
	[A.AUTH_ISSUER]: 'www.nab.com.au',
	[A.AUTH_KEY_SIGN_FILE]: path.resolve(cwd, './_encrypt-key/privatekey.pem'),
	[A.AUTH_KEY_VERIFY_FILE]: path.resolve(cwd, './_encrypt-key/publickey.crt'),
	[C.CACHE_NUM_CONN]: 1,
	[C.CACHE_HOST]: 'localhost',
	[M.MSG_BROKER_HOST]: 'localhost',
	[M.MSG_BROKER_USERNAME]: 'guest',
	[M.MSG_BROKER_PASSWORD]: 'guest',
	[M.MSG_BROKER_EXCHANGE]: 'amq.topic',
	[M.MSG_BROKER_MSG_EXPIRE]: 30e3,
	[RPC.RPC_CALLER_TIMEOUT]: 30e3,
	[RPCCaller.HANDLER_ADDRESS]: 'localhost:8181',
	[W.WEB_PORT]: 3000,
	[W.WEB_URL_PREFIX]: '/api/v1',
	[W.WEB_CORS]: '*',
}
