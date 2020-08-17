import { constants } from '@micro-fleet/common'

const {
	DbClient, Cache: C, Database: D, IdGenerator: ID, MessageBroker: M, Service: S,
} = constants

export = {
	[S.SERVICE_SLUG]: 'nab-product-biz-service',
	[C.CACHE_NUM_CONN]: 0,
	[C.CACHE_HOST]: 'localhost',
	[D.DB_ENGINE]: DbClient.POSTGRESQL,
	[D.DB_HOST]: 'localhost',
	[D.DB_USER]: 'postgres',
	[D.DB_PASSWORD]: 'postgres',
	[D.DB_NAME]: 'nab_challenge',
	[ID.ID_EPOCH]: '1568052735810',
	[M.MSG_BROKER_HOST]: 'localhost',
	[M.MSG_BROKER_USERNAME]: 'guest',
	[M.MSG_BROKER_PASSWORD]: 'guest',
	[M.MSG_BROKER_EXCHANGE]: 'amq.topic',
	[M.MSG_BROKER_HANDLER_QUEUE]: 'nab-product-management-biz-handler',
}
