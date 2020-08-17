import { constants } from '@micro-fleet/common'

const {
	DbClient, Database: D, IdGenerator: ID, MessageBroker: M, RPC, Service: S,
} = constants

export = {
	[S.SERVICE_SLUG]: 'rpc-statistics-biz-server',
	[D.DB_ENGINE]: DbClient.POSTGRESQL,
	[D.DB_HOST]: 'localhost',
	[D.DB_USER]: 'postgres',
	[D.DB_PASSWORD]: 'postgres',
	[D.DB_NAME]: 'nab_challenge',
	[ID.ID_EPOCH]: '1597686511753',
	[RPC.RPC_HANDLER_PORT]: 8080,
	[M.MSG_BROKER_HOST]: 'localhost',
	[M.MSG_BROKER_USERNAME]: 'guest',
	[M.MSG_BROKER_PASSWORD]: 'guest',
	[M.MSG_BROKER_EXCHANGE]: 'amq.topic',
	[M.MSG_BROKER_HANDLER_QUEUE]: 'nab-statistics-biz-handler',
}
