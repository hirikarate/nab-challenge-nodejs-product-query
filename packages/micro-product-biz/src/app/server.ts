import * as path from 'path'

import { registerIdAddOn } from '@micro-fleet/id-generator'
import { MicroServiceBase } from '@micro-fleet/microservice'
import { registerDbAddOn } from '@micro-fleet/persistence'
import {
	registerDirectHandlerAddOn,
	registerMediateHandlerAddOn,
	registerMessageBrokerAddOn,
	DefaultMediateRpcHandlerAddOn,
	DefaultDirectRpcHandlerAddOn,
} from '@micro-fleet/service-communication'

import { Types as T } from './constants/Types'
import { IBranchService } from './contracts/interfaces/IBranchService'
import { BranchService } from './services/BranchService'
import { IBranchRepository, BranchRepository } from './repositories/BranchRepository'

import { ICategoryService } from './contracts/interfaces/ICategoryService'
import { CategoryService } from './services/CategoryService'
import { ICategoryRepository, CategoryRepository } from './repositories/CategoryRepository'

import { IProductService } from './contracts/interfaces/IProductService'
import { ProductService } from './services/ProductService'
import { IProductRepository, ProductRepository } from './repositories/ProductRepository'


class App extends MicroServiceBase {
	/**
	 * @override
	 */
	protected $registerDependencies(): void {
		super.$registerDependencies()

		const dc = this._depContainer
		dc.bindConstructor<IBranchRepository>(T.BRANCH_REPO, BranchRepository).asSingleton()
		dc.bindConstructor<IBranchService>(T.BRANCH_SVC, BranchService).asSingleton()

		dc.bindConstructor<ICategoryRepository>(T.CATEGORY_REPO, CategoryRepository).asSingleton()
		dc.bindConstructor<ICategoryService>(T.CATEGORY_SVC, CategoryService).asSingleton()

		dc.bindConstructor<IProductRepository>(T.PRODUCT_REPO, ProductRepository).asSingleton()
		dc.bindConstructor<IProductService>(T.PRODUCT_SVC, ProductService).asSingleton()
	}

	/**
	 * @override
	 */
	protected $onStarting(): void {
		super.$onStarting()

		this.attachAddOn(registerDbAddOn())
		this.attachAddOn(registerIdAddOn())

		this.attachAddOn(registerMessageBrokerAddOn())

		// If no error handler is registered to RPC handler
		// Uncaught errors will be thrown as normal exceptions.
		const serviceOnError = this.$onError.bind(this)
		const rpcHandlerMediate = registerMediateHandlerAddOn() as DefaultMediateRpcHandlerAddOn
		rpcHandlerMediate.onError(serviceOnError)
		rpcHandlerMediate.controllerPath = path.resolve(__dirname, 'controllers/mediate-controllers')
		this.attachAddOn(rpcHandlerMediate)

		const rpcHandlerDirect = registerDirectHandlerAddOn() as DefaultDirectRpcHandlerAddOn
		rpcHandlerDirect.onError(serviceOnError)
		rpcHandlerDirect.controllerPath = path.resolve(__dirname, 'controllers/direct-controllers')
		this.attachAddOn(rpcHandlerDirect)
	}
}

new App().start().catch(console.error)
