import { registerIdAddOn } from '@micro-fleet/id-generator'
import { MicroServiceBase } from '@micro-fleet/microservice'
import { registerDbAddOn } from '@micro-fleet/persistence'
import { registerMediateHandlerAddOn, registerMessageBrokerAddOn } from '@micro-fleet/service-communication'

import { Types as T } from './constants/Types'
import { IStatisticsService } from './contracts/interfaces/IStatisticsService'
import { StatisticsService } from './services/StatisticsService'
import { IRequestLogRepository, RequestLogRepository } from './repositories/RequestLogRepository'


class App extends MicroServiceBase {
	/**
	 * @override
	 */
	protected $registerDependencies(): void {
		super.$registerDependencies()

		const dc = this._depContainer
		dc.bindConstructor<IRequestLogRepository>(T.REQUEST_LOG_REPO, RequestLogRepository).asSingleton()
		dc.bindConstructor<IStatisticsService>(T.STATISTICS_SVC, StatisticsService).asSingleton()
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
		const rpcHandler: any = registerMediateHandlerAddOn()
		rpcHandler.onError(serviceOnError)
		this.attachAddOn(rpcHandler)
	}
}

new App().start().catch(console.error)
