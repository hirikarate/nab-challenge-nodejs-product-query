import { constants, SettingItemDataType } from '@micro-fleet/common'
import { registerCacheAddOn } from '@micro-fleet/cache'
import { MicroServiceBase } from '@micro-fleet/microservice'
import {
	Types as sT,
	registerMessageBrokerAddOn,
	registerDirectCaller,
	registerMediateCaller,
	IDirectRpcCaller,
	IMediateRpcCaller,
} from '@micro-fleet/service-communication'
import { registerWebAddOn } from '@micro-fleet/web'

import { Types as T } from './constants/Types'
import { RPCCaller } from './constants/RPCCallerSettingKeys'
import { IAuthService } from './contracts/interfaces/IAuthService'
import { AuthService } from './services/AuthService'
import { IJwtHelper } from './contracts/interfaces/IJwtHelper'
import { RsaJwtHelper } from './services/RsaJwtHelper'

import { IBranchService } from './contracts-product-management/interfaces/IBranchService'
import { RemoteBranchService } from './services/RemoteBranchService'

import { ICategoryService } from './contracts-product-management/interfaces/ICategoryService'
import { RemoteCategoryService } from './services/RemoteCategoryService'

import { IProductService } from './contracts-product-management/interfaces/IProductService'
import { RemoteProductDirectService } from './services/RemoteProductDirectService'
import { RemoteProductMediateService } from './services/RemoteProductMediateService'

import { ISearchQueryService } from './contracts-product-search/interfaces/ISearchQueryService'
import { RemoteSearchQueryService } from './services/RemoteSearchQueryService'


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
		dc.bindConstructor<IAuthService>(T.AUTH_SVC, AuthService).asSingleton()
		dc.bindConstructor<IJwtHelper>(T.JWT_HELPER, RsaJwtHelper).asSingleton()

		dc.bindConstructor<IBranchService>(T.BRANCH_SVC, RemoteBranchService).asSingleton()
		dc.bindConstructor<ICategoryService>(T.CATEGORY_SVC, RemoteCategoryService).asSingleton()
		dc.bindConstructor<IProductService>(T.PRODUCT_DIRECT_SVC, RemoteProductDirectService).asSingleton()
		dc.bindConstructor<IProductService>(T.PRODUCT_MEDIATE_SVC, RemoteProductMediateService).asSingleton()
		dc.bindConstructor<ISearchQueryService>(T.SEARCH_SVC, RemoteSearchQueryService).asSingleton()
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
		this._initDirectRpcCaller()
		this._initMediateRpcCaller()
	}

	private _initDirectRpcCaller(): void {
		registerDirectCaller()
		const config = this._configProvider
		const caller = this._depContainer.resolve<IDirectRpcCaller>(sT.DIRECT_RPC_CALLER)
		void caller.init({
			callerName: config.get(S.SERVICE_SLUG).value,
			baseAddress: config.get(RPCCaller.HANDLER_ADDRESS).value,
		})
	}

	private _initMediateRpcCaller(): void {
		registerMediateCaller()
		const config = this._configProvider
		const caller = this._depContainer.resolve<IMediateRpcCaller>(sT.MEDIATE_RPC_CALLER)
		void caller.init({
			callerName: config.get(S.SERVICE_SLUG).value,
			messageExpiredIn: config.get(MB.MSG_BROKER_MSG_EXPIRE, SettingItemDataType.Number).value,
			timeout: config.get(RPC.RPC_CALLER_TIMEOUT, SettingItemDataType.Number).value,
		})
	}

}

new App().start().catch(console.error)
