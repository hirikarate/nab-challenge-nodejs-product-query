/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:statistics')

import * as cm from '@micro-fleet/common'

const { inject } = cm.decorators
import { decorators as d } from '@micro-fleet/service-communication'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/statistics'
import * as pdto from '../contracts-product-management/dto/product'
import * as sdto from '../contracts-product-search/dto/search'
import { IStatisticsService } from '../contracts/interfaces/IStatisticsService'
import { trustPayload } from '../utils/controller-util'


/**
 * Listens to message broker and takes actions when product operations occur.
 */
@d.mediateController()
export default class StatisticsController {
	constructor(@inject(T.STATISTICS_SVC) private _statisticsSvc: IStatisticsService) {
		debug('StatisticsController instantiated')
	}


	/**
	 * Logs the request when a product detail is viewed.
	 */
	@d.action(`request.${pdto.MODULE_NAME}.${pdto.Action.GET_BY_ID}`, true)
	public onGetProductById(
		@d.resolveFn() resolve: Function, // Inject this to disable auto responding
		@trustPayload() params: pdto.GetProductByIdRequest,
	) {
		const {
			viewer,
			...payload
		} = params
		this._createRequestLog('getProductById', viewer, payload)
	}

	/**
	 * Logs the request when products are filtered.
	 */
	@d.action(`request.${sdto.MODULE_NAME}.${sdto.Action.FILTER}`, true)
	public onFilterProduct(
		@d.resolveFn() resolve: Function, // Inject this to disable auto responding
		@trustPayload() params: sdto.FilterRequest,
	) {
		const {
			viewer,
			...payload
		} = params
		this._createRequestLog('filterProduct', viewer, payload)
	}

	/**
	 * Logs the request when products are searched.
	 */
	@d.action(`request.${sdto.MODULE_NAME}.${sdto.Action.SEARCH_ADVANCED}`, true)
	public onAdvancedSearchProduct(
		@d.resolveFn() resolve: Function, // Inject this to disable auto responding
		@trustPayload() params: sdto.SearchAdvancedRequest,
	) {
		const {
			viewer,
			...payload
		} = params
		this._createRequestLog('advancedSearchProduct', viewer, payload)
	}


	private _createRequestLog(
		operationName: string,
		viewer: pdto.ProductViewer | sdto.SearchViewer,
		requestPayload: any,
	): void {
		// Do not log for admin user
		if (!viewer || viewer.userId) {
			return
		}

		const statisticsParams = dto.CreateStatisticsRequest.from(<dto.CreateStatisticsRequest> {
			operationName,
			deviceName: viewer.deviceName,
			ipAddress: viewer.ipAddress,
			requestPayload,
		})
		this._statisticsSvc.create(statisticsParams).catch(console.error)
	}

}
