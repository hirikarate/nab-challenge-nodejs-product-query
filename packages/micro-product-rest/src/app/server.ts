import { constants, SettingItemDataType } from '@micro-fleet/common'
import { registerCacheAddOn } from '@micro-fleet/cache'
import { MicroServiceBase } from '@micro-fleet/microservice'
import {
	Types as sT,
	registerMessageBrokerAddOn,
	registerMediateCaller,
	IMediateRpcCaller,
} from '@micro-fleet/service-communication'
import { registerWebAddOn } from '@micro-fleet/web'

import { Types as T } from './constants/Types'
import { IBranchService } from './contracts-product-management/interfaces/IBranchService'
import { RemoteBranchService } from './services/RemoteBranchService'

import { ICategoryService } from './contracts-product-management/interfaces/ICategoryService'
import { RemoteCategoryService } from './services/RemoteCategoryService'

import { IProductService } from './contracts-product-management/interfaces/IProductService'
import { RemoteProductService } from './services/RemoteProductService'


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
		dc.bindConstructor<IBranchService>(T.BRANCH_SVC, RemoteBranchService).asSingleton()
		dc.bindConstructor<ICategoryService>(T.CATEGORY_SVC, RemoteCategoryService).asSingleton()
		dc.bindConstructor<IProductService>(T.PRODUCT_SVC, RemoteProductService).asSingleton()
	}

	/**
	 * @override
	 */
	protected $onStarting(): void {
		super.$onStarting()

		this.attachAddOn(registerCacheAddOn())
		this.attachAddOn(registerWebAddOn())

		this.attachAddOn(registerMessageBrokerAddOn())
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
