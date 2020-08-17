import { constants, SettingItemDataType } from '@micro-fleet/common'
import { MicroServiceBase } from '@micro-fleet/microservice'
import {
	Types as sT,
	registerMediateHandlerAddOn,
	registerMessageBrokerAddOn,
	registerMediateCaller,
	IMediateRpcCaller,
	DefaultMediateRpcHandlerAddOn,
} from '@micro-fleet/service-communication'

import { Types as T } from './constants/Types'
import { ISearchCommandService } from './contracts/interfaces/ISearchCommandService'
import { ISearchQueryService } from './contracts/interfaces/ISearchQueryService'
import { IProductService } from './contracts-product-management/interfaces/IProductService'
import { ElasticSearchService } from './services/ElasticSearchService'
import { RemoteProductService } from './services/RemoteProductService'
import { AwsEsAddOn } from './addons/AwsEsAddon'


const {
	Service: S,
	MessageBroker: MB,
	RPC,
} = constants

class App extends MicroServiceBase {
	/**
	 * @override
	 */
	protected $registerDependencies(): void {
		super.$registerDependencies()

		const dc = this._depContainer
		dc.bindConstructor<ISearchCommandService>(T.SEARCH_COMMAND_SVC, ElasticSearchService).asSingleton()
		dc.bindConstructor<ISearchQueryService>(T.SEARCH_QUERY_SVC, ElasticSearchService).asSingleton()
		dc.bindConstructor<IProductService>(T.PRODUCT_SVC, RemoteProductService).asSingleton()
	}

	/**
	 * @override
	 */
	protected $onStarting(): void {
		super.$onStarting()

		this.attachAddOn(registerMessageBrokerAddOn())

		// If no error handler is registered to RPC handler
		// Uncaught errors will be thrown as normal exceptions.
		const serviceOnError = this.$onError.bind(this)
		const rpcHandler = registerMediateHandlerAddOn() as DefaultMediateRpcHandlerAddOn
		rpcHandler.onError(serviceOnError)
		this.attachAddOn(rpcHandler)

		const dc = this._depContainer
		dc.bindConstructor(T.AWS_ELASTIC_SEARCH_ADDON, AwsEsAddOn).asSingleton()
		this.attachAddOn(
			dc.resolve(T.AWS_ELASTIC_SEARCH_ADDON),
		)
	}

	public $onStarted(): void {
		super.$onStarted()
		this._initRpcCaller().catch(err => this.$onError(err))
	}

	private async _initRpcCaller(): Promise<void> {
		registerMediateCaller()
		const config = this._configProvider
		const caller = this._depContainer.resolve<IMediateRpcCaller>(sT.MEDIATE_RPC_CALLER)
		await caller.init({
			callerName: config.get(S.SERVICE_SLUG).value,
			messageExpiredIn: config.get(MB.MSG_BROKER_MSG_EXPIRE, SettingItemDataType.Number).value,
			timeout: config.get(RPC.RPC_CALLER_TIMEOUT, SettingItemDataType.Number).value,
		})
	}
}

new App().start().catch(console.error)
